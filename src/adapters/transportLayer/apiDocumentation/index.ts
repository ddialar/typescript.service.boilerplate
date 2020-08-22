import { commonComponents } from './commonComponents.swagger';
import { getManifest, manifestComponents } from './manifest.swagger';

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '0.0.1',
        title: 'Grad Greenhouse Feature Flags service',
        description: 'Grad GreenHouse Feature Flags service.',
        termsOfService: '',
        contact: {
            name: 'GradGreenHouse',
            email: 'info@gradgreenhouse.com',
            url: 'https://www.gradgreenhouse.com/',
        },
        license: {
            name: 'All Rights Reserved.',
            url: 'https://www.gradgreenhouse.com/',
        },
    },
    paths: {
        '/__/manifest': {
            get: getManifest,
        },
    },
    components: {
        schemas: {
            ...commonComponents,
            ...manifestComponents,
        },
    },
};
