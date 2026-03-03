import { digestStringAsync, CryptoDigestAlgorithm, getRandomBytesAsync } from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const KEYS = {
  pinHash: "pvt_pin_hash",
  pinSalt: "pvt_pin_salt",
  recoveryQ1Id: "pvt_recovery_q1_id",
  recoveryQ1Hash: "pvt_recovery_q1_hash",
  recoveryQ1Salt: "pvt_recovery_q1_salt",
  recoveryQ2Id: "pvt_recovery_q2_id",
  recoveryQ2Hash: "pvt_recovery_q2_hash",
  recoveryQ2Salt: "pvt_recovery_q2_salt",
} as const;

async function generateSalt(): Promise<string> {
  const bytes = await getRandomBytesAsync(16);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashWithSalt(value: string, salt: string): Promise<string> {
  return digestStringAsync(CryptoDigestAlgorithm.SHA256, salt + value);
}

export async function storePin(pin: string): Promise<void> {
  const salt = await generateSalt();
  const hash = await hashWithSalt(pin, salt);
  await SecureStore.setItemAsync(KEYS.pinHash, hash);
  await SecureStore.setItemAsync(KEYS.pinSalt, salt);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(KEYS.pinHash);
  const salt = await SecureStore.getItemAsync(KEYS.pinSalt);
  if (!hash || !salt) return false;
  const computed = await hashWithSalt(pin, salt);
  return computed === hash;
}

export async function deletePin(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.pinHash);
  await SecureStore.deleteItemAsync(KEYS.pinSalt);
}

export async function hasPinStored(): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(KEYS.pinHash);
  return hash != null;
}

export async function storeRecoveryAnswers(q1Id: number, a1: string, q2Id: number, a2: string): Promise<void> {
  const norm1 = a1.trim().toLowerCase();
  const norm2 = a2.trim().toLowerCase();

  const salt1 = await generateSalt();
  const salt2 = await generateSalt();
  const hash1 = await hashWithSalt(norm1, salt1);
  const hash2 = await hashWithSalt(norm2, salt2);

  await SecureStore.setItemAsync(KEYS.recoveryQ1Id, String(q1Id));
  await SecureStore.setItemAsync(KEYS.recoveryQ1Hash, hash1);
  await SecureStore.setItemAsync(KEYS.recoveryQ1Salt, salt1);
  await SecureStore.setItemAsync(KEYS.recoveryQ2Id, String(q2Id));
  await SecureStore.setItemAsync(KEYS.recoveryQ2Hash, hash2);
  await SecureStore.setItemAsync(KEYS.recoveryQ2Salt, salt2);
}

export async function verifyRecoveryAnswers(a1: string, a2: string): Promise<boolean> {
  const hash1 = await SecureStore.getItemAsync(KEYS.recoveryQ1Hash);
  const salt1 = await SecureStore.getItemAsync(KEYS.recoveryQ1Salt);
  const hash2 = await SecureStore.getItemAsync(KEYS.recoveryQ2Hash);
  const salt2 = await SecureStore.getItemAsync(KEYS.recoveryQ2Salt);
  if (!hash1 || !salt1 || !hash2 || !salt2) return false;

  const norm1 = a1.trim().toLowerCase();
  const norm2 = a2.trim().toLowerCase();
  const computed1 = await hashWithSalt(norm1, salt1);
  const computed2 = await hashWithSalt(norm2, salt2);
  return computed1 === hash1 && computed2 === hash2;
}

export async function getRecoveryQuestionIds(): Promise<[number, number] | null> {
  const id1 = await SecureStore.getItemAsync(KEYS.recoveryQ1Id);
  const id2 = await SecureStore.getItemAsync(KEYS.recoveryQ2Id);
  if (id1 == null || id2 == null) return null;
  return [Number(id1), Number(id2)];
}

export async function deleteRecoveryAnswers(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.recoveryQ1Id);
  await SecureStore.deleteItemAsync(KEYS.recoveryQ1Hash);
  await SecureStore.deleteItemAsync(KEYS.recoveryQ1Salt);
  await SecureStore.deleteItemAsync(KEYS.recoveryQ2Id);
  await SecureStore.deleteItemAsync(KEYS.recoveryQ2Hash);
  await SecureStore.deleteItemAsync(KEYS.recoveryQ2Salt);
}

export async function hasRecoverySetup(): Promise<boolean> {
  const id1 = await SecureStore.getItemAsync(KEYS.recoveryQ1Id);
  return id1 != null;
}
