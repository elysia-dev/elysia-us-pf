import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../utils/connectors";

function Account() {
  const { chainId, account, activate, deactivate, active } = useWeb3React();
  const onClickActivate = () => {
    activate(injectedConnector);
  };
  const onClickDeactivate = () => {
    deactivate();
  };

  return (
    <div>
      <div> Chain Id: {chainId} </div>
      <div> Account: {account} </div>
      {active ? (
        <div>Connected</div>
      ) : (
        <button onClick={onClickActivate}> Connect </button>
      )}
      {active && <button onClick={onClickDeactivate}>deactivate</button>}
    </div>
  );
}

export default Account;
