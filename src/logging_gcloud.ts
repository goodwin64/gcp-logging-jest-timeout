// ❌ makes jest hang
// import {
//   Logging as GoogleCloudLogging,
//   HttpRequest,
// } from "@google-cloud/logging";

// const logging = new GoogleCloudLogging();

// ✅ if we just import the type and mock the logger - it doesn't hang:
import type { HttpRequest } from "@google-cloud/logging";

const mockLoggerMethod = (
  _metadata: Record<string, unknown>,
  _data?: Record<string, unknown> | string
) => {
  return {
    data: {},
    metadata: {},
  };
};

const mockLogger = {
  info: mockLoggerMethod,
  entry: mockLoggerMethod,
};

const logging = {
  logSync: (_projectId: string) => mockLogger,
  log: (_projectId: string) => mockLogger,
};

// no matter if we use logSync or log - the result is the same
// export const logger = logging.logSync("test-project-id");
export const logger = logging.log("test-project-id");

const metadata = {
  resource: { type: "global" },
};

export const appLogger = {
  info: (message: unknown) =>
    logger.info(logger.entry(metadata, String(message))),
};
