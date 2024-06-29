const { spawnSync } = require("child_process");

async function main3() {
  // run the same test 20 times
  // count how many times it took >3 seconds (hangs with a timeout)

  const globalStartTime = new Date().getTime();

  let hangsCounter = 0;
  const testFile =
    "/Users/maxdonchenko/flash-pack-dot-com/server/src/resolvers/checkout/extrasUtils.test.ts";

  for (let i = 0; i < 20; i++) {
    console.log(`Run ${i + 1}`);

    const startTime = new Date().getTime();

    console.time("spawn");
    spawnSync(`yarn test:dev extras ${testFile} --runInBand`, {
      shell: true,
      stdio: "inherit",
    });
    console.timeEnd("spawn");

    const endTime = new Date().getTime();
    const duration = endTime - startTime;

    if (duration > 3000) {
      hangsCounter++;
    }
  }

  const globalEndTime = new Date().getTime();

  console.log("Hangs:", hangsCounter);
  console.log(
    "Total duration:",
    (globalEndTime - globalStartTime) / 1000,
    " sec"
  );
  console.log(
    "Average duration:",
    (globalEndTime - globalStartTime) / 20,
    " ms"
  );

  /*
  results are (for 20 runs):
  1. default:
  Hangs: 6
  Total duration: 68.842  sec
  Average duration: 3442.1  ms

  2. 
  server/src/testHelpers/matchers.ts "expect.extend" is commented out - all matchers are disabled: 
  Hangs: 0
  Total duration: 34.21  sec
  Average duration: 1710.5  ms

  3. toMatchGraphQlError matcher is enabled:
  Hangs: 0
  Total duration: 34.781  sec
  Average duration: 1739.05  ms

  4. toMatchGraphQlErrors matcher is enabled:
  Hangs: 0
  Total duration: 34.267  sec
  Average duration: 1713.35  ms

  5. toIncludeGraphQlErrorCode matcher is enabled:
  Hangs: 0
  Total duration: 34.229  sec
  Average duration: 1711.45  ms

  6. toHaveInputVariable async matcher is enabled:
  Hangs: 0
  Total duration: 34.254  sec
  Average duration: 1712.7  ms

  7. toRequireRoles async matcher is enabled (the same as step 1, to double-check):
  Hangs: 6
  Total duration: 71.139  sec
  Average duration: 3556.95  ms

  8. toRequireRoles matcher - I enabled the "const pass = allRoles.every..." part:
  Hangs: 0
  Total duration: 35.422  sec
  Average duration: 1771.1  ms

  9. I enabled the "const authorizationErrorPresent = errors.some..." part
  Hangs: 5
  Total duration: 70.203  sec
  Average duration: 3510.15  ms

  10. I used a string literal replacement:
  (error) => error?.extensions?.code === AuthorizationError.code, 👇
  (error) => error?.extensions?.code === 'AUTHORIZATION_ERROR',
  Hangs: 0
  Total duration: 36.327  sec
  Average duration: 1816.35  ms  <--- meaning that the problem is either with '@src/auth' import, or the static property

  11. I added an exported constant near the class and used it in the matcher:
  export const AuthErrorCode = 'AUTHORIZATION_ERROR';
  (error) => error?.extensions?.code === AuthErrorCode,
  Hangs: 6
  Total duration: 72.74  sec
  Average duration: 3637  ms  <--- so the problem is with import as exported constant also hangs

  12. To confirm this assumption, I copied class AuthorizationError with a static code property:
  Hangs: 0
  Total duration: 36.657  sec
  Average duration: 1832.85  ms

  13. I commented out the "export { AuthService } from './AuthService';" part
  keeping the old usage of class and static property:
  Hangs: 0
  Total duration: 37.763  sec
  Average duration: 1888.15  ms

  14. I separated error classes into its own file so that jest matcher setup
  doesn't import the problematic AuthService file:
  Hangs: 0
  Total duration: 36.013  sec
  Average duration: 1800.65  ms

  15. Out of curiosity, I kept only imports in the AuthService file, commented out the rest:
  Hangs: 0
  Total duration: 35.76  sec
  Average duration: 1788  ms

  16. Uncommented FirebaseActionType, emulator_host, isEmulator - OK, no hangs
  17. Uncommented AuthService.constructor - OK
  18. Uncommented AuthService.getPlatformFromFirebaseUser - OK
  Hangs: 0
  Total duration: 36.672  sec
  Average duration: 1833.6  ms

  19. AuthService.getFirebaseUser - OK
  20. AuthService.getDatabaseUser - OK
  21. AuthService.updateFirebaseIdIfDifferent - OK
  22. AuthService.sendOneTimeLoginCode - OK
  23. AuthService.getUserFromHeaders - hangs:
  Hangs: 6
  Total duration: 66.517  sec
  Average duration: 3325.85  ms

  24. Replaced the AuthedUser import with a locally declared stub class - OK
  25. Uncommented the rest of methods in AuthService - it hangs:
  Hangs: 5
  Total duration: 68.396  sec
  Average duration: 3419.8  ms

  26. Uncommented AuthService.getPlatformsForRole - OK
  27. Uncommented AuthService.findOrCreateFirebaseUser - OK
  27. Uncommented AuthService.getFirebaseActionUrl - OK
  28. Uncommented AuthService.firebaseAuthorizationHeaders - OK
  29. Uncommented AuthService.validateCheckoutPassword - OK
  30. Uncommented AuthService.sendEmailSigninLink - OK:
  Hangs: 0
  Total duration: 38.838  sec
  Average duration: 1941.9  ms

  31. Uncommented AuthService.updateOrCreateFirebaseCustomer - OK:
  Hangs: 0
  Total duration: 40.971  sec
  Average duration: 2048.55  ms

  32. Uncommented AuthService.findOrCreateUser - hangs:
  Hangs: 5
  Total duration: 62.136  sec
  Average duration: 3106.8  ms

  33. With 1 line commented out it doesn't hang:
  } catch (e) {
    // appLogger.error(e);
    await this.firebase.auth.deleteUser(firebaseUser.uid);
    throw ensureApolloError(e);
  }
  Hangs: 0
  Total duration: 40.173  sec
  Average duration: 2008.65  ms

  ^ meaning that appLogger import is problematic

  34. In "server/src/apollo_server/logging_gcloud.ts" it doesn't matter if we use:
  export const logger = logging.logSync('adventure-product-server');
  or
  export const logger = logging.log('adventure-product-server');

  It still hangs.

  35. It stop hanging when we stub the Logging class and only import types:
  // import { Logging as GoogleCloudLogging, HttpRequest } from '@google-cloud/logging';
  import type { HttpRequest } from '@google-cloud/logging';

  Hangs: 0
  Total duration: 41.666  sec
  Average duration: 2083.3  ms

  */
}

main3();
