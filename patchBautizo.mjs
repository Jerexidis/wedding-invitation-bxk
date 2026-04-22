import fs from 'fs'

const file = 'src/templates/InvitacionBautizo.jsx'
let content = fs.readFileSync(file, 'utf8')

const targetSection = `<div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-8 relative">
                        {config.events?.map((event, i) => (
                            <div key={i} className={\`flex flex-col items-center text-center \${i > 0 ? "pt-8 border-t border-bautizo-accent/20" : ""}\`}>
                                <div className="p-4 bg-bautizo-light rounded-full mb-4">
                                    {event.icon === 'church' ? <Church className="w-8 h-8 text-bautizo-primary" /> : <MapPin className="w-8 h-8 text-bautizo-primary" />}
                                </div>
                                <h3 className="text-xl font-bold text-bautizo-dark mb-2 font-serif">{event.title}</h3>
                                <p className="text-bautizo-text font-medium">{event.location}</p>
                                <p className="text-bautizo-primary font-bold mt-3">{event.time}</p>
                                {event.mapLink && (
                                    <a href={event.mapLink} target="_blank" rel="noreferrer" className="text-sm mt-3 text-bautizo-accent hover:text-bautizo-primary underline">Ver mapa</a>
                                )}
                            </div>
                        ))}
                    </div>`

const replacementSection = `<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {config.events?.map((event, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center text-center border border-bautizo-accent/15">
                                <div className="w-16 h-16 bg-bautizo-light rounded-full flex items-center justify-center mb-4">
                                    {event.icon === 'church' ? <Church size={28} className="text-bautizo-primary" /> : <MapPin size={28} className="text-bautizo-primary" />}
                                </div>
                                <h3 className="text-2xl font-vibes text-bautizo-dark mb-2">{event.title}</h3>
                                <p className="text-bautizo-text font-medium px-4">{event.location}</p>
                                <p className="text-bautizo-primary font-bold mt-3 text-lg">{event.time}</p>
                                {event.mapLink && (
                                    <a href={event.mapLink} target="_blank" rel="noreferrer" className="text-sm mt-4 text-bautizo-accent hover:text-bautizo-primary underline inline-block">Ver mapa de llegada</a>
                                )}
                            </div>
                        ))}
                    </div>`

if (content.includes('className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-8 relative"')) {
    content = content.replace(targetSection, replacementSection)
    fs.writeFileSync(file, content, 'utf8')
    console.log('Bautizo cards patched successfully.')
} else {
    console.log('Bautizo target section not found or already patched.')
}
