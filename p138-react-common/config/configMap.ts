export enum ClientTypeTYPE {
  admin = 'admin',
  customer = 'customer',
  business = 'business',
}
export const configMap: Record<
  ClientTypeTYPE,
  {
    platform: 'admin' | 'business' | 'customer';
  }
> = {
  admin: {
    platform: 'admin',
  },
  business: {
    platform: 'business',
  },
  customer: {
    platform: 'customer',
  },
};
