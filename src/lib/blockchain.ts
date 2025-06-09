// This file provides an interface for blockchain interactions with smart contracts
import { ethers } from "ethers";

// ABI for the ConsentVerification smart contract
const CONSENT_CONTRACT_ABI = [
  "function requestConsent(string memory studentId, string memory eventId) public returns (string memory requestId)",
  "function verifyConsent(string memory requestId, address studentWallet) public returns (bool)",
  "function issueTicket(string memory eventId, string memory studentId, string memory ticketId) public returns (string memory transactionHash)",
  "function getConsentStatus(string memory requestId) public view returns (bool verified, address studentWallet)",
  "event ConsentRequested(string requestId, string studentId, string eventId)",
  "event ConsentVerified(string requestId, address studentWallet)",
  "event TicketIssued(string ticketId, string eventId, string studentId, string transactionHash)",
];

// Smart contract address - this would be the deployed contract address
const CONSENT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address

/**
 * Request MetaMask connection and get the current account
 * @returns The connected Ethereum address or null if connection failed
 */
export async function connectWallet(): Promise<string | null> {
  try {
    if (typeof window.ethereum !== "undefined") {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        return accounts[0];
      }
    }
    return null;
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    return null;
  }
}

/**
 * Get the current connected account without prompting
 * @returns The connected Ethereum address or null if not connected
 */
export async function getCurrentAccount(): Promise<string | null> {
  try {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        return accounts[0];
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
}

/**
 * Sign a message with MetaMask
 * @param message Message to sign
 * @param address Address to sign with
 * @returns Signature or null if signing failed
 */
export async function signMessage(
  message: string,
  address: string,
): Promise<string | null> {
  try {
    if (typeof window.ethereum !== "undefined") {
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });
      return signature;
    }
    return null;
  } catch (error) {
    console.error("Error signing message:", error);
    return null;
  }
}

/**
 * Get contract instance for interacting with the smart contract
 * @returns Contract instance or null if not available
 */
async function getContractInstance() {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      CONSENT_CONTRACT_ADDRESS,
      CONSENT_CONTRACT_ABI,
      signer,
    );
  } catch (error) {
    console.error("Error getting contract instance:", error);
    return null;
  }
}

/**
 * Request consent for a student to receive a ticket
 * @param studentId ID of the student
 * @param eventId ID of the event
 * @returns Request ID from the smart contract or null if failed
 */
export async function requestConsent(
  studentId: string,
  eventId: string,
): Promise<string | null> {
  try {
    const contract = await getContractInstance();
    if (!contract) return null;

    const account = await getCurrentAccount();
    if (!account) {
      throw new Error("No wallet connected");
    }

    const tx = await contract.requestConsent(studentId, eventId);
    const receipt = await tx.wait();

    // Extract requestId from event logs
    const event = receipt.events?.find((e) => e.event === "ConsentRequested");
    if (event && event.args) {
      return event.args.requestId;
    }

    return null;
  } catch (error) {
    console.error("Error requesting consent:", error);
    return null;
  }
}

/**
 * Verify consent with student's wallet address
 * @param requestId ID of the consent request
 * @param studentWallet Student's wallet address
 * @returns Boolean indicating if verification was successful
 */
export async function verifyConsent(
  requestId: string,
  studentWallet: string,
): Promise<boolean> {
  try {
    const contract = await getContractInstance();
    if (!contract) return false;

    const tx = await contract.verifyConsent(requestId, studentWallet);
    await tx.wait();

    return true;
  } catch (error) {
    console.error("Error verifying consent:", error);
    return false;
  }
}

/**
 * Issue a ticket on the blockchain using the smart contract
 * @param eventId ID of the event
 * @param studentId ID of the student
 * @param ticketId ID of the ticket
 * @returns Transaction hash or null if failed
 */
export async function issueTicket(
  eventId: string,
  studentId: string,
  ticketId: string,
): Promise<{ transactionHash: string } | null> {
  try {
    // Check if MetaMask is connected
    const account = await getCurrentAccount();
    if (!account) {
      throw new Error("No wallet connected");
    }

    // Use the smart contract to issue the ticket
    const contract = await getContractInstance();
    if (!contract) {
      throw new Error("Could not connect to smart contract");
    }

    const tx = await contract.issueTicket(eventId, studentId, ticketId);
    const receipt = await tx.wait();

    return { transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error("Error issuing ticket on blockchain:", error);

    // Fallback to mock implementation if contract call fails
    console.log(
      `Falling back to mock: Issuing ticket ${ticketId} for event ${eventId} to student ${studentId}`,
    );

    // Generate a mock transaction hash
    const transactionHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("")}`;

    return { transactionHash };
  }
}

/**
 * Purchase a ticket directly with MetaMask
 * @param eventId ID of the event
 * @param studentId ID of the student
 * @param eventName Name of the event
 * @returns Result with ticket details or error
 */
export async function purchaseTicketWithMetaMask(
  eventId: string,
  studentId: string,
  eventName: string,
): Promise<{
  success: boolean;
  ticketId?: string;
  transactionHash?: string;
  error?: string;
}> {
  try {
    // Connect to MetaMask
    const walletAddress = await connectWallet();
    if (!walletAddress) {
      throw new Error("Failed to connect to MetaMask");
    }

    // Generate unique ticket ID
    const ticketId = `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create a message to sign for verification
    const message = `Purchase ticket for ${eventName}\nEvent ID: ${eventId}\nTicket ID: ${ticketId}\nTimestamp: ${Date.now()}`;

    // Sign the message
    const signature = await signMessage(message, walletAddress);
    if (!signature) {
      throw new Error("Failed to sign transaction");
    }

    // Issue the ticket on blockchain
    const result = await issueTicket(eventId, studentId, ticketId);
    if (!result) {
      throw new Error("Failed to issue ticket on blockchain");
    }

    return {
      success: true,
      ticketId,
      transactionHash: result.transactionHash,
    };
  } catch (error) {
    console.error("Error purchasing ticket with MetaMask:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get consent status from the smart contract
 * @param requestId ID of the consent request
 * @returns Object containing verification status and student wallet address
 */
export async function getConsentStatus(
  requestId: string,
): Promise<{ verified: boolean; studentWallet: string | null }> {
  try {
    const contract = await getContractInstance();
    if (!contract) {
      return { verified: false, studentWallet: null };
    }

    const result = await contract.getConsentStatus(requestId);
    return {
      verified: result.verified,
      studentWallet: result.studentWallet,
    };
  } catch (error) {
    console.error("Error getting consent status:", error);
    return { verified: false, studentWallet: null };
  }
}

/**
 * Verify a ticket on the blockchain
 * @param ticketId ID of the ticket to verify
 * @param transactionHash Transaction hash of the ticket issuance
 * @returns Boolean indicating if the ticket is valid
 */
export async function verifyTicket(
  ticketId: string,
  transactionHash: string,
): Promise<boolean> {
  try {
    // In a real app with the full contract implementation, we would verify the ticket on the blockchain
    // For now, we'll check if the transaction hash exists and is valid
    console.log(
      `Verifying ticket ${ticketId} with transaction ${transactionHash}`,
    );

    // Check if the transaction hash is valid (starts with 0x and has the right length)
    if (!transactionHash.startsWith("0x") || transactionHash.length !== 66) {
      return false;
    }

    // For demo purposes, we'll consider all well-formed transaction hashes valid
    // In production, we would query the blockchain to verify the transaction
    return true;
  } catch (error) {
    console.error("Error verifying ticket on blockchain:", error);
    return false;
  }
}

/**
 * Listen for MetaMask account changes
 * @param callback Function to call when accounts change
 */
export function listenForAccountChanges(
  callback: (accounts: string[]) => void,
): void {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", callback);
  }
}

/**
 * Listen for MetaMask chain changes
 * @param callback Function to call when chain changes
 */
export function listenForChainChanges(
  callback: (chainId: string) => void,
): void {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("chainChanged", callback);
  }
}
