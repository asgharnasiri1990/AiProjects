import type { Provider } from "../types";
import { farnaa } from "./farnaa";
import { technolife } from "./technolife";

export const PROVIDERS: Provider[] = [technolife, farnaa];

export function getProvider(id: string): Provider | undefined {
  return PROVIDERS.find((provider) => provider.id === id);
}
