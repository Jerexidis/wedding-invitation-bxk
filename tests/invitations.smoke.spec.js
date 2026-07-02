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
