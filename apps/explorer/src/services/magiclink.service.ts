import { Magic, SDKError } from "@magic-sdk/admin";
import { Env, WalletGuardians } from "../config";
import { obscureEmail } from "../utils";

const mAdmin = new Magic(Env.MAGIC_SECRET_API_KEY);

export const getMagicAccountFromGuardianAddresses = async (
  guardianAddresses: Array<string>
): Promise<WalletGuardians["magicAccountGuardian"]> => {
  const metadataForGuardians = await Promise.all(
    guardianAddresses.map(async (guardianAddress) => {
      try {
        const metadata = await mAdmin.users.getMetadataByPublicAddress(
          guardianAddress
        );
        if (metadata.email && metadata.publicAddress) {
          return {
            maskedEmail: obscureEmail(metadata.email),
            guardianAddress: metadata.publicAddress,
          };
        }
        return null;
      } catch (error) {
        if (
          error instanceof SDKError &&
          error.data[0]?.error_code === "RESOURCE_NOT_FOUND"
        ) {
          // Guardian not a Magic account.
          return null;
        }

        throw error;
      }
    })
  );

  return metadataForGuardians.filter(Boolean)[0];
};
