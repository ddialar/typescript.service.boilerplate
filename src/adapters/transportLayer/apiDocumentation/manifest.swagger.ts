export const getManifest = {
    tags: ['Admin'],
    description: 'Returns the service manifest file',
    operationId: 'manifest',
    responses: {
        '200': {
            description: 'manifest response',
            content: {
                'application/json': {
                    schema: {
                        oneOf: [
                            {
                                $ref: '#/components/schemas/EmptyManifest',
                            },
                            {
                                $ref: '#/components/schemas/Manifest',
                            },
                        ],
                    },
                },
            },
        },
        default: {
            description: 'unexpected error',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error',
                    },
                },
            },
        },
    },
};

export const manifestComponents = {
    EmptyManifest: {
        type: 'object',
        minProperties: 0,
        maxProperties: 0,
    },
    Manifest: {
        type: 'object',
        required: ['name', 'version', 'timestamp', 'scm'],
        properties: {
            name: {
                type: 'string',
            },
            version: {
                type: 'string',
            },
            timestamp: {
                type: 'string',
            },
            scm: {
                type: 'object',
                required: ['remote', 'branch', 'commit'],
                remote: {
                    type: 'string',
                },
                branch: {
                    type: 'string',
                },
                commit: {
                    type: 'string',
                },
            },
        },
    },
};
