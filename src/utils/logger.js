const { createLogger, format, transports } = require('winston');

const {
  combine,
  printf,
  colorize,
  align,
} = format;

const logFormat = printf(({ level, message }) => (`[${level}]: ${message}`));

const logger = createLogger({
  format: combine(colorize(), align(), logFormat),
  transports: [new transports.Console()],
});

module.exports = {
  logger,
};
