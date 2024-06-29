import { appLogger } from "../logging_gcloud";

interface CustomMatchers<R = unknown> {
  toMatchCustomMatcher(expected: unknown): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

expect.extend({
  async toMatchCustomMatcher(received: unknown) {
    // let's pretend we need this logger here;
    // in fact, we just need to use a problematic import
    appLogger.info({ received });

    return {
      message: () => ``,
      pass: true,
    };
  },
});
