beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["hello"],
    changeMethods: [],
    sender: window.accountId,
  })

  window.walletConnection = {
    requestSignIn() {},
    signOut() {},
    isSignedIn() {
      return true
    },
    getAccountId() {
      return window.accountId
    },
  }
})

test("hello", async () => {
  const message = await window.contract.hello({
    name: "Afonso",
    account_id: window.accountId,
  })
  expect(message).toEqual("Hello Afonso!")
})
