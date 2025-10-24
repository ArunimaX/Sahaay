export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '^@shared/(.*)$': '<rootDir>/shared/$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                module: 'ESNext',
                moduleResolution: 'node',
            }
        }]
    },
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/__tests__/**/*.test.tsx',
        '**/*.test.ts',
        '**/*.test.tsx'
    ],
    collectCoverageFrom: [
        'server/**/*.ts',
        'shared/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/build/**'
    ],
    setupFilesAfterEnv: [],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    verbose: true
};