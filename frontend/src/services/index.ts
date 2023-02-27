import mobxStore from '@/mobxStore';

const fetchData = (api: string, data: any): any => {
  const [method, url] = api.split(' ');
  const Authorization = mobxStore.user.getToken();
  if (method === 'GET') {
    return fetch(`${url}?${new URLSearchParams(data as any).toString()}`, {
      headers: { Authorization },
      method,
    }).then((res) => res.json());
  } else {
    return fetch(url, {
      headers: { Authorization },
      method,
      body: data instanceof FormData ? data : JSON.stringify(data),
    }).then((res) => res.json());
  }
};

export type ServiceTypes = {
  'POST /login': {
    req: { username: string; password: string };
    res: { success: boolean; data: { token: string } };
  };
  'GET /list': {
    req: {};
    res: {};
  };
};

export const services = new Proxy(
  {},
  {
    get: (_t, p) => {
      return (data: any) => fetchData(p as string, data);
    },
  },
) as {
  [api in keyof ServiceTypes]: (
    data: ServiceTypes[api]['req'],
  ) => Promise<ServiceTypes[api]['res']>;
};
