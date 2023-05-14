import mobxStore from '@/mobxStore';
import type ServiceTypes from './serviceTypes';
import constants from '@/constants';

const fetchData = async (
  api: string,
  _data?: Record<string, any>,
): Promise<any> => {
  const [method, url] = api.split(' ');
  const Authorization = mobxStore.user.getToken();
  let res: Response;
  const data: Record<string, any> = {};
  _data &&
    Object.keys(_data).forEach((key) => {
      if (_data[key] !== undefined && _data[key] !== null) {
        data[key] = _data[key];
      }
    });

  if (method === 'GET') {
    res = await fetch(
      `${constants.FETCH_ROOT}${url}${
        data ? '?' + new URLSearchParams(data).toString() : ''
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
      body: JSON.stringify(data),
    });
  }

  if (res.status === 401) {
    mobxStore.user.logoff();
    throw new Error('请重新登录');
  }

  if (res.ok) {
    const result = await res.json();
    if (result.success) return result;
    throw new Error(result.message || res.statusText);
  } else {
    throw new Error(res.statusText);
  }
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
