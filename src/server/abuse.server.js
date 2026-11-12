import { getRequest } from "@tanstack/react-start/server";
import { clientIp, throttle } from "./auth.server";

/**
 * Limite les formulaires publics (contact, messagerie) par adresse IP et par destinataire :
 * sans cela, n'importe qui pourrait inonder un artiste d'e-mails ou saturer la base.
 */
export async function limitPublicSubmission(scope, targetId) {
  const request = getRequest();
  await throttle(`${scope}:ip:${clientIp(request)}`, 8, 3600);
  if (targetId) await throttle(`${scope}:target:${targetId}`, 30, 3600);
}
