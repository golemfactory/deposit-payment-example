import { UserState } from "types/user";

import { Remarkable } from "remarkable";
import { __ } from "ramda";

const md = new Remarkable();

export const copy: any = (() => {
  return {
    [UserState.DISCONNECTED]: {
      title: "Hello Golem Developer!",
      message: {
        __html: md.render(
          `Welcome to our example service for Deposit payments on Golem.
          We're glad to have you here. 
          This version will show you step by step how Golem deposit payments work and how You can benefit from it on your very own service.  \n This example service is inspired by a real-world service called VirusTotal. VirusTotal is well well-renowned service that analyzes suspicious files and URLs by running them through multiple antivirus engines and URL scanners to detect malware and malicious content. You can access the original service under this [Link](https://www.virustotal.com/gui/home/upload).  \nOf course, our service is a little bit less ambitious as it aims to present how deposit payments can be utilized by the Golem community. Consequently, our service will let you scan files on the ClamAV engine and give the results of such scans.  \nLast but not least, we are utilizing the Holesky testnet for this example. It means that you need a Metamask wallet with both Holesky tETH and Holesky tGLM. To obtain Holesky tETH feel free to use one of the following faucets:  \n[Faucet 1](https://holesky-faucet.pk910.de/)  \n[Faucet 2](https://faucet.quicknode.com/ethereum/holesky)  \n[Faucet 3](https://faucet.chainstack.com/holesky-testnet-faucet)  \n[Faucet 4](https://www.holeskyfaucet.io/)  \nAfter You obtain some tETH, you can request tGLM tokens from this Smart Contract by calling the "Create" function:  \n[GLM Faucet Smart Contract](https://holesky.etherscan.io/address/0xface100969ff47eb58d2cf603321b581a84bceac) When You are ready to start, click the "Connect Wallet" button. This button will initialize the following steps of the process:  \n-Connect Your Metamask Wallet with Web Service \n-Register Your wallet to the Service via SIWE (Sign-In with Ethereum) standard  \nHave fun!`
        ),
      },
    },
    get [UserState.CONNECTED]() {
      return this[UserState.DISCONNECTED];
    },
    [UserState.REGISTERED]: {
      title: "You are Registered!",
      message: {
        __html:
          md.render(`Congratulations! You are now successfully registered with our example service. The next step in the process is to provide approval for the GLM tokens stored in your wallet. This approval is given to the Deposit Smart Contract (0x9CB8Ecc74e299eF9D3cBcf8f806F5C7b76CA08D3) and can be revoked or extended at any time. It is a necessary step to create a deposit later on. It is important to emphasize that this step has to be done by the service user.
          `),
      },
    },
    get [UserState.NOT_GRANTED]() {
      return this[UserState.REGISTERED];
    },
    [UserState.HAS_NO_DEPOSIT]: {
      title: "Approval successfully given!",
      message: {
        __html:
          md.render(`Great job! With Approval in place now is time to create a Deposit.
The deposit consists of three values:
amount: that is the amount of GLM tokens You are willing to spend on the service. This amount will be locked so that there is a limited risk of the user running out without paying :) That value should be provided by the User.
fee: that is a fee that will be sent to the Service Owner. In this instance, it is Golem Factory. However, for Your own service, it will be You! It is not mandatory but can be utilized to make your service profitable or at least refund the costs of running it. In normal conditions, this value should be set by the Service user. However, in this example, we make it editable so that You can play around with it.
timestamp: it points to the place in time till which Deposit will be held on the Smart Contract. As already mentioned this mechanism is chosen to limit the risk of people running away without paying for service.
          `),
      },
    },
    get [UserState.GRANTED]() {
      return this[UserState.HAS_NO_DEPOSIT];
    },

    [UserState.HAS_DEPOSIT]: {
      title: "Time to create Allocation!",
      message: {
        __html:
          md.render(`Allocation is a logical entity created in Yagna, which keeps track of how much money the Requestor wishes to pay the Provider for his computation power. In our scenario Allocation will be created for the same amount as the Deposit. It is because those two entities are interconnected in Deposit Payments as GLMs stored at the Deposit will be used to cover Allocation payments.
          In a normal scenario, Allocation should be created automatically by Yagna so User interaction is not needed. However, in our example service we let you create it manually so there is a better understanding of what is happening behind the UI. Click "Create" next to Allocation.
        `),
      },
    },
    get [UserState.HAS_NO_ALLOCATION]() {
      return this[UserState.HAS_DEPOSIT];
    },
    [UserState.HAS_ALLOCATION]: {
      title: "Let’s find a Golem Provider for the job!",
      message: {
        __html:
          md.render(`It is high time to sign the Agreement and find our Golem Provider. By clicking "Create" next to the Agreement section You will trigger Yagna to start looking for a Provider on the Golem network to run our file scanning example. It might take a while, but when it is done Agreement will be signed between Service Owner Yagna and the Provider.
          The provider will also be ready to accept files for us to scan. What is more, We will start to receive "debit notes" from a Provider, which will inform us about how many GLM tokens we own at this moment. Please remember that Providers can also charge for a time they are ready to receive work and not only for work being done. You will see the amount You own Provider under Due payments. It is refreshed in real-time..
        `),
      },
    },
    [UserState.HAS_AGREEMENT]: {
      title: "You have agreement signed!",
      message: {
        __html:
          md.render(`You have successfully signed the agreement with the Provider. 
            Now it is time to upload the file for scanning. 
            You can do it by clicking the "Upload" button. 
            After the file is uploaded, it will be scanned by the Provider.
              Once the scan is completed, you will receive event with the results 
              `),
      },
    },
    ["HAS_FILE_SCANNED"]: {
      title: "You have scanned your first file!",
      message: {
        __html:
          md.render(`We hope that the results are negative :) At this point, You can either continue scanning more files or release the Agreement.
          When You decide to release the agreement following things will happen:
          The provider will send a final invoice for his services
          Deposit Payment will be sent to cover the invoice
          When Payment is done, You can check it out on Etherscan by clicking on Transaction ID in the event log on the left. At this point Amount Locked on the Deposit should be equal to the remaining Allocation value.

            `),
      },
    },
    ["AGREEMENT_RELEASED"]: {
      title: "Agreement released!",
      message: {
        __html: md.render(`
          Congratulations, You have successfully released the Agreement and as a result paid the Provider for his work.
          The next step is to release Allocation. By clicking "Release" in the Allocation:
          The deposit will be released
          All not spent funds will be returned to the end-user
          Deposit Fee will be transferred to Service Owner
        `),
      },
    },
    ["DEPOSIT_RELEASED"]: {
      title: "Congratulations!",
      message: {
        __html:
          md.render(`You have successfully reached out to the end of this example.
            We hope You liked it and that it inspired You to create similar service on Golem. At this moment You can either create new Deposit to start the process again or clean the current session and close the browser window.
`),
      },
    },
    ["SCANED_FILES"]: {
      title: "fdsfsd",
      message: {
        __html: "fsdfsdf",
      },
    },
    ["WAITING_FOR_AGREEMENT_PAYMENT"]: {
      title: "fdsfsd",
      message: {
        __html: "fsdfsdf",
      },
    },
    ["WAITING_FOR_DEPOSIT_PAYMENT"]: {
      title: "fdsfsd",
      message: {
        __html: "fsdfsdf",
      },
    },
  };
})();
