To reproduce the issue:

1. `yarn install`
2. `yarn test`

From the output logs:

```
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```
