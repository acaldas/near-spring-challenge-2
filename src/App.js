import "regenerator-runtime/runtime"
import React from "react"
import "./global.css"

import getConfig from "./config"
const { networkId } = getConfig(process.env.NODE_ENV || "development")

export default function App() {
  const [name, setName] = React.useState()
  const [response, setResponse] = React.useState()
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [showNotification, setShowNotification] = React.useState(false)

  return (
    <>
      <main>
        <h1>
          <label
            htmlFor="name"
            style={{
              color: "var(--secondary)",
            }}
          >
            Say hello!
          </label>
        </h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault()

            // get elements from the form using their id attribute
            const { fieldset, name } = event.target.elements

            // hold onto new user-entered value from React's SynthenticEvent for use after `await` call
            const newName = name.value

            // disable the form while the value gets updated on-chain
            fieldset.disabled = true

            try {
              const response = await window.contract.hello({
                name: newName,
              })
              console.log(response)
              setResponse(response)
            } catch (e) {
              alert("Something went wrong!")
              throw e
            } finally {
              // re-enable the form, whether the call succeeded or failed
              fieldset.disabled = false
            }

            setName(newName)
            setShowNotification(true)
            setTimeout(() => {
              setShowNotification(false)
            }, 11000)
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="name"
              style={{
                display: "block",
                color: "var(--gray)",
                marginBottom: "0.5em",
              }}
            >
              What's your name?
            </label>
            <div style={{ display: "flex" }}>
              <input
                autoComplete="off"
                defaultValue={name}
                id="name"
                onChange={(e) => setButtonDisabled(e.target.value === name)}
                style={{ flex: 1 }}
              />
              <button
                disabled={buttonDisabled}
                style={{ borderRadius: "0 5px 5px 0" }}
              >
                Send
              </button>
            </div>
          </fieldset>
        </form>
      </main>
      {showNotification && <Notification response={response} />}
    </>
  )
}

function Notification({ response }) {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      Called method: 'hello' in contract:{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <h2>{response}</h2>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
