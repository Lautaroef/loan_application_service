interface Config {
  jwtSecret: string;
}

const config: Config = {
  jwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;
