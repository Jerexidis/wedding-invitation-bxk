import { useEffect, useState } from 'react';

const DressCode = ({ data, basePath }) => {
    const imageSrc = data?.image ? `${basePath}/img/${data.image}` : null;
    const [imageFailed, setImageFailed] = useState(false);
    const isFormal = data?.type?.toLowerCase().includes('formal');
    const iconSize = "w-32 h-32 md:w-36 md:h-36";

    useEffect(() => {
        setImageFailed(false);
    }, [imageSrc]);

    return (
        <section className="relative py-16 px-4 bg-inv-light text-center overflow-hidden dress-code-section">
            <div className="max-w-sm mx-auto bg-white p-8 rounded-3xl shadow-md border border-inv-lily/50 relative z-10 dress-code-card">
                <h3 className="text-lg font-semibold text-inv-dark uppercase tracking-widest mb-6 dress-code-title">
                    Código de Vestimenta
                </h3>
                <div className="bg-gradient-to-br from-inv-cream to-inv-light p-6 rounded-2xl border border-inv-lily/30 mb-4 dress-code-inner">
                    <div className="flex justify-center mb-5 dress-code-icon-wrap">
                        {imageSrc && !imageFailed ? (
                            <img
                                src={imageSrc}
                                alt=""
                                loading="lazy"
                                className={`${iconSize} object-contain opacity-80 dress-code-image`}
                                onError={() => { setImageFailed(true); }}
                            />
                        ) : isFormal ? (
                            <FormalDressCodeIcon className={`${iconSize} text-inv-primary dress-code-line-icon`} />
                        ) : (
                            <GenericDressCodeIcon className={`${iconSize} text-inv-primary dress-code-line-icon`} />
                        )}
                    </div>
                    <p className="font-bold text-inv-primary text-2xl tracking-wide dress-code-type">{data.type}</p>
                </div>
            </div>
        </section>
    );
};

const FormalDressCodeIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 160 96"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <g transform="translate(9 6) scale(3.55)">
            <path strokeWidth="1.5" d="M10 3v2l4-2v2Z" />
            <path strokeWidth="1.5" d="M18 3h1a2 2 0 0 1 1.7 3A5271 5271 0 0 0 12 21S6.8 12 3.3 6A2 2 0 0 1 5 3h1m6 6h.01M12 13h.01" />
            <path strokeWidth="1.5" d="M21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" />
        </g>
        <g transform="translate(77 6) scale(3.55)">
            <path strokeWidth="1.45" d="m15 4l-3 2l-3-2c-.586.51-1.93 1.293-1.997 2.146c-.029.37.126.571.435.975C8.112 8.002 9 8.521 9 10h6c0-1.48.888-1.998 1.562-2.879c.31-.404.464-.606.434-.975C16.93 5.293 15.587 4.509 15 4M9 4V2m6 2V2m-5.5 8h5m3.5 9c2 0 3-2.173 3-2.173c-2.825-1.836-4.5-3.993-5.413-5.622c-.347-.62-.521-.93-.755-1.068C14.598 10 14.285 10 13.659 10H10.34c-.626 0-.939 0-1.173.137s-.408.447-.755 1.068C7.5 12.834 5.825 14.99 3 16.827C3 16.827 4 19 6 19" />
            <path strokeWidth="1.45" d="M13.706 14c.34.796 1.815 2.671 3.435 4.31c.597.605.896.907.855 1.42c-.04.512-.29.683-.79 1.025C16.07 21.53 14.336 22 12 22s-4.07-.469-5.207-1.245c-.5-.342-.75-.513-.79-1.025c-.04-.513.259-.815.856-1.42c1.62-1.639 3.096-3.514 3.435-4.31" />
        </g>
        <path strokeWidth="3" opacity="0.5" d="M63 74c11-4 23-4 34 0" />
    </svg>
);

const GenericDressCodeIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 96 96"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M48 18c0-6 4-10 10-10 5 0 9 4 9 9 0 9-12 11-19 20" />
        <path d="M48 37 18 58c-4 3-2 9 3 9h57c5 0 7-6 3-9L48 37Z" />
        <path d="M30 67c4 9 13 15 24 15s20-6 24-15" />
        <path d="M36 50c6 4 18 4 24 0" />
    </svg>
);

export default DressCode;
