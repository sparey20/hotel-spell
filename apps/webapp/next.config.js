//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextProdConfig = {
  ...nextConfig,
  output: 'export',
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextDevConfig = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3000/api/:path*`,
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(
  process.env.NODE_ENV === 'development' ? nextDevConfig : nextProdConfig
);
