import { connect, Contract, keyStores, WalletConnection } from "near-api-js"
import getConfig from "./config"

const nearConfig = getConfig(process.env.NODE_ENV || "development")

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  )

  const account = await near.account(nearConfig.contractName)

  window.contract = await new Contract(account, nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ["hello"],
  })
}
