import mobxStore from '@/mobxStore';
import type ServiceTypes from './serviceTypes';
import constants from '@/constants';

const fetchData = async (api: string, data: any): Promise<any> => {
  const [method, url] = api.split(' ');
  const Authorization = mobxStore.user.getToken();
  let res: Response;
  if (method === 'GET') {
    res = await fetch(
      `${constants.FETCH_ROOT}${url}${
        data ? '?' + new URLSearchParams(data ).toString() : ''
      }`,
      {
        headers: { Authorization },
        method,
      },
    );
  } else {
    res = await fetch(`${constants.FETCH_ROOT}${url}`, {
      headers: {
        Authorization,
        'Content-Type': 'application/json; charset=utf-8',
      },
      method,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  if (res.status === 401) {
    mobxStore.user.logoff();
    throw new Error('请重新登录');
  }

  const result = await res.json();
  if (result.success) return result;

  throw new Error(result.message || res.statusText);
};

export default new Proxy(
  {},
  {
    get: (_t, p) => {
      return async (data: any) => await fetchData(p as string, data);
    },
  },
) as {
  [api in keyof ServiceTypes]: (
    data: ServiceTypes[api]['req'],
  ) => Promise<ServiceTypes[api]['res']>;
};
