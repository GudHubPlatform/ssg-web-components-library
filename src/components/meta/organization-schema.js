class OrganizationSchema extends GHComponent {
    constructor() {
        super();
    }

    async onServerRender() {
        let language = window.constants.currentLanguage;
        
        const generalInfo = language ? window.getConfig().componentsConfigs.generalInfo.find(config => config.langCode === language) : window.getConfig().componentsConfigs.generalInfo;
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": generalInfo.name,
            "legalName": generalInfo.legalName,
            "url": `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}`,
            "logo": `${window.MODE === 'production' ? 'https' : 'http'}://${window.getConfig().website}/assets/images/logo.svg`,
            "foundingDate": generalInfo.foundingDate,
            "founders": [
                {
                    "@type": "Person",
                    "name": generalInfo.founders
                }
            ],
            "address": {
                "@type": "PostalAddress",
                "streetAddress": generalInfo.separatedAddress.streetAddress,
                "addressLocality": generalInfo.separatedAddress.addressLocality,
                "addressRegion": generalInfo.separatedAddress.addressRegion,
                "postalCode": generalInfo.separatedAddress.postalCode,
                "addressCountry": generalInfo.separatedAddress.addressCountry
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "telephone": `[${generalInfo.phone}]`,
                "email": generalInfo.email
            },
            "sameAs": [generalInfo.socLinks.linkedin, generalInfo.socLinks.facebook, generalInfo.socLinks.instagram, generalInfo.socLinks.twitter]
        }

        if (!document.head.querySelector('#organizationSchema')) {

            document.head.innerHTML += `
                <script id="organizationSchema" type="application/ld+json">${JSON.stringify(schema)}</script>
            `;

        }
        this.remove();
    }
}

window.customElements.define('organization-schema', OrganizationSchema);