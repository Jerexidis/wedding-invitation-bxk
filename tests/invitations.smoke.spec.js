import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const inventoryPath = path.resolve('docs/invitations.inventory.json')
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
const invitations = inventory.invitations.filter((invitation) => invitation.enabled)

async function inspectInvitation(page, slug) {
    const consoleErrors = []
    const pageErrors = []
    page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
    })
    page.on('pageerror', (error) => pageErrors.push(error.message))

    const response = await page.goto(`/i/${slug}?portfolio=1`, {
        waitUntil: 'domcontentloaded',
    })
    expect(response?.status(), `${slug} route status`).toBe(200)
    await expect(page.locator('#root > *')).toBeVisible()
    await expect.poll(
        async () => (await page.locator('#root').innerText()).trim().length,
        { message: `${slug} rendered content` },
    ).toBeGreaterThan(40)

    await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager'
        window.scrollTo(0, document.documentElement.scrollHeight)
        await Promise.all(
            Array.from(document.images, (image) =>
                image.complete
                    ? Promise.resolve()
                    : new Promise((resolve) => {
                        image.addEventListener('load', resolve, { once: true })
                        image.addEventListener('error', resolve, { once: true })
                    })),
        )
    })

    const state = await page.evaluate(() => ({
        rootTextLength: document.querySelector('#root')?.textContent?.trim().length || 0,
        brokenImages: Array.from(document.images)
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
        horizontalOverflow:
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        errorBoundary: document.body.textContent?.includes('Error en la invitación') || false,
    }))

    expect(state.rootTextLength, `${slug} rendered content`).toBeGreaterThan(40)
    expect(state.errorBoundary, `${slug} error boundary`).toBe(false)
    expect(state.horizontalOverflow, `${slug} horizontal overflow`).toBe(false)
    expect(state.brokenImages, `${slug} broken images`).toEqual([])
    expect(pageErrors, `${slug} page errors`).toEqual([])
    expect(consoleErrors, `${slug} console errors`).toEqual([])
}

test.describe('active invitations on mobile', () => {
    for (const invitation of invitations) {
        test(invitation.slug, async ({ page }) => {
            await inspectInvitation(page, invitation.slug)
        })
    }
})

test('representative architectures render on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const slug of [
        'plantilla-boda-editorial',
        'isabella',
        'victoria-rojas',
        'kassandra-brian',
    ]) {
        await inspectInvitation(page, slug)
    }
})

test('Gretel and Geraldine album is linked and renders on mobile', async ({ page }) => {
    await page.route('**/api/albums/gretel-y-geraldine', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ photos: [] }),
        })
    })

    await page.goto('/i/gretel-y-geraldine')
    const albumLink = page.getByRole('link', { name: 'Compartir fotos de la celebración' })
    await expect(albumLink).toHaveAttribute('href', '/i/gretel-y-geraldine/album')

    await page.goto('/i/gretel-y-geraldine/album')
    await expect(page.getByRole('heading', { name: 'El reino de nuestros recuerdos' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Compartir mis fotos' })).toBeEnabled()
    await expect(page.getByText('Tu recuerdo puede encender el primer farol')).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    )
    expect(hasHorizontalOverflow).toBe(false)
})

test('public legal routes render and are linked from the homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Privacidad' })).toHaveAttribute('href', '/privacidad')
    await expect(page.getByRole('link', { name: 'Términos' })).toHaveAttribute('href', '/terminos')

    for (const [path, heading] of [
        ['/privacidad', 'Política de privacidad'],
        ['/terminos', 'Términos del servicio'],
    ]) {
        await page.goto(path)
        await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Volver a Invita-Ya' })).toHaveAttribute('href', '/')
        const hasHorizontalOverflow = await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        )
        expect(hasHorizontalOverflow).toBe(false)
    }
})
