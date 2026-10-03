const baseConfig = require('./base.js');

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
module.exports = {
  ...baseConfig,
  importOrder: [
    '^react(.*)$',
    '^react-native$',
    '^react-native(.*)$',
    '^expo(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@/api/(.*)$',
    '^@/assets/(.*)$',
    '^@/db/(.*)$',
    '^@/containers/(.*)$',
    '^@/components/(.*)$',
    '^@/config/(.*)$',
    '^@/constants/(.*)$',
    '^@/context/(.*)$',
    '^@/features/(.*)$',
    '^@/hooks/(.*)$',
    '^@/i18n/(.*)$',
    '^@/lib/(.*)$',
    '^@/navigation/(.*)$',
    '^@/routes/(.*)$',
    '^@/routing/(.*)$',
    '^@/services/(.*)$',
    '^@/schema/(.*)$',
    '^@/styles/(.*)$',
    '^@/types/(.*)$',
    '^@/utils/(.*)$',
    '^[./]',
  ],
};
