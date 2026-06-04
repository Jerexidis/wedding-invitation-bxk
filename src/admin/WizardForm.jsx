import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, Plus, Loader2, Check, ArrowRight, ArrowLeft, Palette, Trash2, Image, Upload } from 'lucide-react'
import { generatePalette, DISPLAY_FONTS, BODY_FONTS, DEFAULT_THEME } from '../utils/themeEngine'

const API = '/api/invitations'

const slugify = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
const eventLabels = { xv: 'XV Años', boda: 'Boda', bautizo: 'Bautizo', cumple: 'Cumpleaños', otro: 'Celebración' }
const STEPS = ['Evento', 'Familia', 'Ubicaciones', 'Detalles', 'Galería', 'Diseño', 'RSVP', 'Confirmar']

const hslColor = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`

export default function WizardForm({ onBack, showToast }) {
    const [step, setStep] = useState(0)
    const [creating, setCreating] = useState(false)

    // Load all Google Fonts on mount for display inside select options and preview
    useEffect(() => {
        const allFonts = [...DISPLAY_FONTS, ...BODY_FONTS]
        const families = allFonts.map(f => `family=${f.replace(/\s+/g, '+')}`).join('&')
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`
        document.head.appendChild(link)
        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link)
            }
        }
    }, [])
    const [form, setForm] = useState({
        eventType: 'xv', slug: '', title: '', name: '', date: '', time: '19:00',
        parent1: '', parent2: '', parentLabel1: '', parentLabel2: '',
        padrino1: '', padrino2: '', padrinosEnabled: true,
        ceremonyName: '', ceremonyAddress: '', ceremonyTime: '19:00', ceremonyMap: '',
        receptionName: '', receptionAddress: '', receptionTime: '20:00', receptionMap: '',
        dressCode: 'Formal', dressCodeEnabled: true,
        giftsEnabled: true, giftsType: 'envelope', giftsMessage: 'Tu presencia es mi mayor regalo, pero si deseas tener un detalle conmigo:',
        giftsLink: '', giftsLinkText: 'Ver Mesa de Regalos',
        rsvpMode: 'whatsapp', whatsappNumber: '',
        galleryPhotos: [],
        primaryHue: DEFAULT_THEME.primaryHue, primarySat: DEFAULT_THEME.primarySat,
        accentHue: DEFAULT_THEME.accentHue,
        fontBody: 'Montserrat', fontDisplay: 'Great Vibes',
    })

    const update = (key, val) => {
        setForm(prev => {
            const next = { ...prev, [key]: val }
            if (key === 'name' || key === 'eventType') {
                const name = key === 'name' ? val : prev.name
                const type = key === 'eventType' ? val : prev.eventType
                next.slug = slugify(name)
                next.title = `${eventLabels[type] || type} | ${name}`
            }
            return next
        })
    }

    const buildConfig = () => {
        const dateObj = new Date(`${form.date}T${form.time}:00`)
        const endDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000)
        const fmtDT = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0]
        const fmtOutlook = (d) => d.toISOString().split('.')[0]
        const displayDate = dateObj.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
        const displayYear = dateObj.getFullYear().toString()
        return {
            slug: form.slug, eventType: form.eventType, title: form.title,
            theme: { primaryHue: form.primaryHue, primarySat: form.primarySat, accentHue: form.accentHue, fontBody: form.fontBody, fontDisplay: form.fontDisplay },
            hero: { subtitle: form.eventType === 'xv' ? '✨ Mis XV Años ✨' : form.eventType === 'boda' ? '💍 Nuestra Boda 💍' : '✨ Celebración ✨', name: form.name, date: dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(), backgroundImage: 'hero-bg.png', song: '' },
            intro: { message: 'Con la bendición de Dios', label: form.eventType === 'boda' ? 'Padres de los Novios' : 'Mis Papás', parent1: form.parent1, parent2: form.parent2, closingMessage: form.eventType === 'xv' ? 'Tienen el honor de invitarte a celebrar los XV Años' : 'Tienen el honor de invitarte' },
            padrinos: { enabled: form.padrinosEnabled, label: 'Mis Padrinos', subtitle: 'Con el cariño de', padrino1: form.padrino1, padrino2: form.padrino2 },
            countdown: { targetDate: `${form.date}T${form.time}:00`, displayDate, displayYear },
            calendar: { title: form.title, description: '¡Celebra con nosotros!', location: form.receptionName + ', ' + form.receptionAddress, startDateTime: fmtDT(dateObj), endDateTime: fmtDT(endDate), outlookStart: fmtOutlook(dateObj), outlookEnd: fmtOutlook(endDate), icsFilename: `${form.slug}.ics`, icsProdId: form.title },
            events: [
                { icon: 'church', title: 'Ceremonia Religiosa', location: form.ceremonyName, address: form.ceremonyAddress, time: form.ceremonyTime, mapLink: form.ceremonyMap },
                { icon: 'party', title: 'Recepción', location: form.receptionName, address: form.receptionAddress, time: form.receptionTime, mapLink: form.receptionMap },
            ],
            dressCode: { enabled: form.dressCodeEnabled, type: form.dressCode, image: 'dresscode-icon.png' },
            gallery: { photos: form.galleryPhotos.filter(p => p.src.trim()).map(p => ({ src: p.src, caption: p.caption })) },
            gifts: { enabled: form.giftsEnabled, title: 'Mesa de Regalos', message: form.giftsMessage, type: form.giftsType, envelopeText: 'Lluvia de Sobres', envelopeDescription: 'Tradición de regalar efectivo en sobres.', link: form.giftsLink, linkText: form.giftsLinkText },
            itinerary: { enabled: false, items: [] },
            rsvp: { mode: form.rsvpMode, whatsappNumber: form.whatsappNumber, whatsappConfirmMessage: '¡Hola! Soy {name}. Confirmo mi asistencia para {guests} persona(s). 🎉', whatsappDeclineMessage: 'Hola! Soy {name}. Lamentablemente no podré asistir.', deadline: 'Por favor confirma tu asistencia', directMessage: { enabled: false } },
            footer: { name: form.name, subtitle: `${eventLabels[form.eventType] || 'Celebración'} • ${displayDate}` },
        }
    }

    const handleCreate = async () => {
        setCreating(true)
        try {
            const config = buildConfig()
            const photosToUpload = form.galleryPhotos
                .filter(p => p.src.trim() && p.fileData)
                .map(p => ({ name: p.src, data: p.fileData }))

            const res = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: form.slug, title: form.title, config, photos: photosToUpload })
            })
            const json = await res.json()
            if (json.ok) { showToast(`Invitación creada — ${json.path}`); onBack() }
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
        setCreating(false)
    }

    return (
        <>
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={onBack} className="btn-icon"><ChevronLeft size={18} /></button>
                    <h2>Nueva invitación</h2>
                </div>
            </div>
            <div className="admin-content" style={{ maxWidth: 640, margin: '0 auto' }}>
                {/* Steps */}
                <div className="wizard-steps">
                    {STEPS.map((s, i) => (
                        <div key={i} className={`wizard-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} onClick={() => setStep(i)} style={{ cursor: 'pointer' }}>
                            <div className="step-num">{i < step ? <Check size={14} /> : i + 1}</div>
                            <div className="step-label">{s}</div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-body">
                        {step === 0 && <>
                            <div className="form-group">
                                <label className="form-label">Tipo de evento</label>
                                <select value={form.eventType} onChange={e => update('eventType', e.target.value)} className="form-input">
                                    <option value="xv">XV Años</option><option value="boda">Boda</option><option value="bautizo">Bautizo</option><option value="cumple">Cumpleaños</option><option value="otro">Otro</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nombre del festejado(a)</label>
                                <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Ej: Melani Marisol" className="form-input" />
                                {form.slug && <div className="url-preview">URL: <code>/i/{form.slug}</code></div>}
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Fecha del evento</label><input type="date" value={form.date} onChange={e => update('date', e.target.value)} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Hora de inicio</label><input type="time" value={form.time} onChange={e => update('time', e.target.value)} className="form-input" /></div>
                            </div>
                        </>}

                        {step === 1 && <>
                            {form.eventType === 'boda' ? <>
                                <div className="section-divider"><span>Padres del Novio</span></div>
                                <div className="form-group"><label className="form-label">Padre del novio</label><input value={form.parent1} onChange={e => update('parent1', e.target.value)} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Madre del novio</label><input value={form.parentLabel1} onChange={e => update('parentLabel1', e.target.value)} className="form-input" /></div>
                                <div className="section-divider"><span>Padres de la Novia</span></div>
                                <div className="form-group"><label className="form-label">Padre de la novia</label><input value={form.parent2} onChange={e => update('parent2', e.target.value)} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Madre de la novia</label><input value={form.parentLabel2} onChange={e => update('parentLabel2', e.target.value)} className="form-input" /></div>
                            </> : <>
                                <div className="section-divider"><span>Padres</span></div>
                                <div className="form-group"><label className="form-label">Padre / Nombre 1</label><input value={form.parent1} onChange={e => update('parent1', e.target.value)} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Madre / Nombre 2</label><input value={form.parent2} onChange={e => update('parent2', e.target.value)} className="form-input" /></div>
                            </>}
                            <div className="toggle-row">
                                <label className="toggle"><input type="checkbox" checked={form.padrinosEnabled} onChange={e => update('padrinosEnabled', e.target.checked)} /><span className="toggle-slider" /></label>
                                <span className="toggle-label">Incluir sección de padrinos</span>
                            </div>
                            {form.padrinosEnabled && <>
                                <div className="section-divider"><span>Padrinos</span></div>
                                <div className="form-group"><label className="form-label">Padrino</label><input value={form.padrino1} onChange={e => update('padrino1', e.target.value)} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Madrina</label><input value={form.padrino2} onChange={e => update('padrino2', e.target.value)} className="form-input" /></div>
                            </>}
                        </>}

                        {step === 2 && <>
                            <div className="section-divider"><span>Ceremonia religiosa</span></div>
                            <div className="form-group"><label className="form-label">Nombre del lugar</label><input value={form.ceremonyName} onChange={e => update('ceremonyName', e.target.value)} placeholder="Parroquia Santa María" className="form-input" /></div>
                            <div className="form-group"><label className="form-label">Dirección</label><input value={form.ceremonyAddress} onChange={e => update('ceremonyAddress', e.target.value)} className="form-input" /></div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Hora</label><input type="time" value={form.ceremonyTime} onChange={e => update('ceremonyTime', e.target.value)} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Link Google Maps</label><input value={form.ceremonyMap} onChange={e => update('ceremonyMap', e.target.value)} placeholder="https://maps.app.goo.gl/..." className="form-input" /></div>
                            </div>
                            <div className="section-divider"><span>Recepción</span></div>
                            <div className="form-group"><label className="form-label">Nombre del lugar</label><input value={form.receptionName} onChange={e => update('receptionName', e.target.value)} placeholder="Quinta Sarai" className="form-input" /></div>
                            <div className="form-group"><label className="form-label">Dirección</label><input value={form.receptionAddress} onChange={e => update('receptionAddress', e.target.value)} className="form-input" /></div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Hora</label><input type="time" value={form.receptionTime} onChange={e => update('receptionTime', e.target.value)} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Link Google Maps</label><input value={form.receptionMap} onChange={e => update('receptionMap', e.target.value)} placeholder="https://maps.app.goo.gl/..." className="form-input" /></div>
                            </div>
                        </>}

                        {step === 3 && <>
                            <div className="toggle-row">
                                <label className="toggle"><input type="checkbox" checked={form.dressCodeEnabled} onChange={e => update('dressCodeEnabled', e.target.checked)} /><span className="toggle-slider" /></label>
                                <span className="toggle-label">Código de vestimenta</span>
                            </div>
                            {form.dressCodeEnabled && <div className="form-group"><label className="form-label">Tipo</label>
                                <select value={form.dressCode} onChange={e => update('dressCode', e.target.value)} className="form-input">
                                    <option value="Formal">Formal</option><option value="Semi-formal">Semi-formal</option><option value="Casual">Casual</option><option value="Cocktail">Cocktail</option>
                                </select></div>}

                            <div className="toggle-row" style={{ marginTop: 16 }}>
                                <label className="toggle"><input type="checkbox" checked={form.giftsEnabled} onChange={e => update('giftsEnabled', e.target.checked)} /><span className="toggle-slider" /></label>
                                <span className="toggle-label">Mesa de regalos</span>
                            </div>
                            {form.giftsEnabled && <>
                                <div className="form-group"><label className="form-label">Tipo de regalo</label>
                                    <select value={form.giftsType} onChange={e => update('giftsType', e.target.value)} className="form-input">
                                        <option value="envelope">Lluvia de sobres (efectivo)</option>
                                        <option value="link">Link externo (Amazon, Liverpool, etc.)</option>
                                    </select>
                                </div>
                                {form.giftsType === 'link' && <>
                                    <div className="form-group"><label className="form-label">URL de la mesa de regalos</label><input value={form.giftsLink} onChange={e => update('giftsLink', e.target.value)} placeholder="https://www.amazon.com.mx/..." className="form-input" /></div>
                                    <div className="form-group"><label className="form-label">Texto del botón</label><input value={form.giftsLinkText} onChange={e => update('giftsLinkText', e.target.value)} placeholder="Ver Mesa de Regalos" className="form-input" /></div>
                                </>}
                                <div className="form-group"><label className="form-label">Mensaje</label><textarea value={form.giftsMessage} onChange={e => update('giftsMessage', e.target.value)} rows={2} className="form-input" /></div>
                            </>}
                        </>}

                        {step === 4 && <>
                            <div className="section-divider"><span>Fotos de la galería</span></div>
                            <p className="form-hint" style={{ marginBottom: 16 }}>Selecciona y carga las fotos para la galería. Se guardarán automáticamente en la carpeta de la invitación al crearla.</p>
                            {form.galleryPhotos.map((photo, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, padding: 12, border: '1px solid #e8eaed', borderRadius: 12, background: '#f8f9fa' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        {photo.fileData ? (
                                            <img src={photo.fileData} alt="Preview" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid #dadce0' }} />
                                        ) : (
                                            <div style={{ width: 40, height: 40, borderRadius: 6, background: '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5f6368' }}><Image size={18} /></div>
                                        )}
                                        <input value={photo.src} onChange={e => { const next = [...form.galleryPhotos]; next[idx] = { ...next[idx], src: e.target.value }; update('galleryPhotos', next) }} placeholder="nombre_archivo.jpg" className="form-input" style={{ flex: 1 }} />
                                        <input value={photo.caption} onChange={e => { const next = [...form.galleryPhotos]; next[idx] = { ...next[idx], caption: e.target.value }; update('galleryPhotos', next) }} placeholder="Título / Leyenda" className="form-input" style={{ flex: 1 }} />
                                        <button onClick={() => { const next = form.galleryPhotos.filter((_, i) => i !== idx); update('galleryPhotos', next) }} className="btn-icon" style={{ flexShrink: 0 }}><Trash2 size={16} style={{ color: '#c5221f' }} /></button>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 48 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id={`file-upload-${idx}`}
                                            style={{ display: 'none' }}
                                            onChange={e => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        const next = [...form.galleryPhotos];
                                                        next[idx] = {
                                                            ...next[idx],
                                                            src: file.name,
                                                            fileData: event.target.result
                                                        };
                                                        update('galleryPhotos', next);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <label htmlFor={`file-upload-${idx}`} className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                            <Upload size={12} /> Cargar foto
                                        </label>
                                        {photo.fileData && (
                                            <span style={{ fontSize: 11, color: '#5f6368' }}>
                                                Listo ({Math.round((photo.fileData.length * 3) / 4 / 1024)} KB)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => update('galleryPhotos', [...form.galleryPhotos, { src: '', caption: '', fileData: null }])} className="btn btn-secondary" style={{ marginTop: 8 }}><Plus size={14} /> Agregar foto</button>
                            {form.galleryPhotos.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: '#9aa0a6' }}>
                                    <Image size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                                    <p style={{ fontSize: 13 }}>Sin fotos. Agrega y selecciona las imágenes para subirlas.</p>
                                </div>
                            )}
                        </>}

                        {step === 5 && <>
                            <div className="section-divider"><span>Paleta de colores</span></div>
                            <div className="form-group">
                                <label className="form-label">Color primario — Tono ({form.primaryHue}°)</label>
                                <input type="range" min="0" max="360" value={form.primaryHue} onChange={e => update('primaryHue', parseInt(e.target.value))} className="form-input" style={{ padding: 0, height: 8, cursor: 'pointer', accentColor: hslColor(form.primaryHue, form.primarySat, 30) }} />
                                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                    {[0, 30, 60, 120, 180, 210, 270, 330].map(h => (
                                        <button key={h} onClick={() => update('primaryHue', h)} style={{ width: 32, height: 32, borderRadius: 8, border: form.primaryHue === h ? '2px solid #1a73e8' : '2px solid transparent', background: hslColor(h, 60, 30), cursor: 'pointer', transition: '0.15s' }} />
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Color de acento — Tono ({form.accentHue}°)</label>
                                <input type="range" min="0" max="360" value={form.accentHue} onChange={e => update('accentHue', parseInt(e.target.value))} className="form-input" style={{ padding: 0, height: 8, cursor: 'pointer', accentColor: hslColor(form.accentHue, 100, 50) }} />
                                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                    {[30, 48, 60, 0, 280, 200, 160, 330].map(h => (
                                        <button key={h} onClick={() => update('accentHue', h)} style={{ width: 32, height: 32, borderRadius: 8, border: form.accentHue === h ? '2px solid #1a73e8' : '2px solid transparent', background: hslColor(h, 100, 50), cursor: 'pointer', transition: '0.15s' }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 16, padding: 12, background: '#f8f9fa', borderRadius: 10, border: '1px solid #e8eaed' }}>
                                <div style={{ flex: 1, height: 40, borderRadius: 8, background: hslColor(form.primaryHue, form.primarySat, 24) }} title="Primary" />
                                <div style={{ flex: 1, height: 40, borderRadius: 8, background: hslColor(form.primaryHue, form.primarySat, 35) }} title="Primary Light" />
                                <div style={{ flex: 1, height: 40, borderRadius: 8, background: hslColor(form.accentHue, 100, 50) }} title="Accent" />
                                <div style={{ flex: 1, height: 40, borderRadius: 8, background: hslColor(form.primaryHue, 40, 96) }} title="Cream" />
                                <div style={{ flex: 1, height: 40, borderRadius: 8, background: hslColor(form.primaryHue, 60, 10) }} title="Dark" />
                            </div>
                            <div className="section-divider"><span>Tipografía</span></div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Fuente títulos</label>
                                    <select value={form.fontDisplay} onChange={e => update('fontDisplay', e.target.value)} className="form-input" style={{ fontFamily: `'${form.fontDisplay}', cursive` }}>
                                        {DISPLAY_FONTS.map(f => <option key={f} value={f} style={{ fontFamily: `'${f}', cursive` }}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Fuente cuerpo</label>
                                    <select value={form.fontBody} onChange={e => update('fontBody', e.target.value)} className="form-input" style={{ fontFamily: `'${form.fontBody}', sans-serif` }}>
                                        {BODY_FONTS.map(f => <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: 16, padding: 16, background: '#ffffff', borderRadius: 12, border: '1px solid #e8eaed', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <p style={{ fontSize: 10, color: '#9aa0a6', textTransform: 'uppercase', tracking: '0.1em', marginBottom: 8, fontWeight: 600 }}>Vista previa de fuentes combinadas</p>
                                <div style={{ fontFamily: `'${form.fontDisplay}', cursive`, fontSize: 32, color: hslColor(form.primaryHue, form.primarySat, 24), marginBottom: 4 }}>
                                    {form.name || 'Festejado(a)'}
                                </div>
                                <div style={{ fontFamily: `'${form.fontBody}', sans-serif`, fontSize: 14, color: '#3c4043', lineHeight: 1.6 }}>
                                    Te invitamos a celebrar con nosotros este día tan especial.
                                </div>
                            </div>
                        </>}

                        {step === 6 && <>
                            <div className="form-group"><label className="form-label">Modo de confirmación (RSVP)</label>
                                <select value={form.rsvpMode} onChange={e => update('rsvpMode', e.target.value)} className="form-input">
                                    <option value="whatsapp">WhatsApp — Redirige a wa.me</option>
                                    <option value="supabase">Dashboard interno — Base de datos</option>
                                    <option value="none">Sin RSVP</option>
                                </select>
                                <p className="form-hint">{form.rsvpMode === 'whatsapp' ? 'Los invitados serán redirigidos a WhatsApp con un mensaje pre-llenado' : form.rsvpMode === 'supabase' ? 'Las confirmaciones se guardarán en la base de datos con dashboard administrativo' : 'No se mostrará sección de confirmación'}</p>
                            </div>
                            {form.rsvpMode === 'whatsapp' && <div className="form-group"><label className="form-label">Número de WhatsApp</label><input value={form.whatsappNumber} onChange={e => update('whatsappNumber', e.target.value)} placeholder="524691761149" className="form-input" /><p className="form-hint">Incluye código de país sin + (ej: 52 para México)</p></div>}
                        </>}

                        {step === 7 && <>
                            <div className="summary-grid">
                                <div className="summary-item"><div className="s-label">Evento</div><div className="s-value">{eventLabels[form.eventType]}</div></div>
                                <div className="summary-item"><div className="s-label">Nombre</div><div className="s-value">{form.name || '—'}</div></div>
                                <div className="summary-item"><div className="s-label">Fecha</div><div className="s-value">{form.date || '—'}</div></div>
                                <div className="summary-item"><div className="s-label">Hora</div><div className="s-value">{form.time || '—'}</div></div>
                                <div className="summary-item"><div className="s-label">Ceremonia</div><div className="s-value">{form.ceremonyName || '—'}</div></div>
                                <div className="summary-item"><div className="s-label">Recepción</div><div className="s-value">{form.receptionName || '—'}</div></div>
                                <div className="summary-item"><div className="s-label">RSVP</div><div className="s-value">{form.rsvpMode === 'whatsapp' ? 'WhatsApp' : form.rsvpMode === 'supabase' ? 'Dashboard' : 'Sin RSVP'}</div></div>
                                <div className="summary-item"><div className="s-label">Galería</div><div className="s-value">{form.galleryPhotos.length} foto(s)</div></div>
                                <div className="summary-item"><div className="s-label">Colores</div><div className="s-value"><span style={{ display:'inline-block', width:14, height:14, borderRadius:4, background: hslColor(form.primaryHue, form.primarySat, 24), verticalAlign: 'middle', marginRight: 4 }}/>  <span style={{ display:'inline-block', width:14, height:14, borderRadius:4, background: hslColor(form.accentHue, 100, 50), verticalAlign: 'middle' }}/></div></div>
                            </div>
                        </>}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                    <button onClick={step === 0 ? onBack : () => setStep(s => s - 1)} className="btn btn-secondary">
                        {step === 0 ? 'Cancelar' : <><ArrowLeft size={14} /> Anterior</>}
                    </button>
                    {step < 7 ? (
                        <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">Siguiente <ArrowRight size={14} /></button>
                    ) : (
                        <button onClick={handleCreate} disabled={creating} className="btn btn-primary">
                            {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Crear invitación
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}
