import '@testing-library/jest-dom';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

class HeadersMock {
  private map = new Map<string, string>();

  constructor(init?: Record<string, string>) {
    if (init) {
      Object.entries(init).forEach(([key, value]) => this.set(key, value));
    }
  }

  get(key: string): string | null {
    return this.map.get(key.toLowerCase()) ?? null;
  }

  set(key: string, value: string) {
    this.map.set(key.toLowerCase(), value);
  }
}

type RequestInitLike = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

class RequestMock {
  url: string;
  method: string;
  headers: HeadersMock;
  private bodyText: string;

  constructor(url: string, init?: RequestInitLike) {
    this.url = url;
    this.method = init?.method ?? 'GET';
    this.headers = new HeadersMock(init?.headers);
    this.bodyText = init?.body ?? '';
  }

  async json(): Promise<unknown> {
    if (!this.bodyText) return {};
    return JSON.parse(this.bodyText) as unknown;
  }
}

type ResponseInitLike = {
  status?: number;
  headers?: Record<string, string>;
};

class ResponseMock {
  status: number;
  headers: HeadersMock;
  private bodyText: string;

  constructor(body?: string, init?: ResponseInitLike) {
    this.bodyText = body ?? '';
    this.status = init?.status ?? 200;
    this.headers = new HeadersMock(init?.headers);
  }

  async json(): Promise<unknown> {
    if (!this.bodyText) return {};
    return JSON.parse(this.bodyText) as unknown;
  }
}

if (typeof global.Headers === 'undefined') {
  Object.defineProperty(global, 'Headers', {
    writable: true,
    value: HeadersMock,
  });
}

if (typeof global.Request === 'undefined') {
  Object.defineProperty(global, 'Request', {
    writable: true,
    value: RequestMock,
  });
}

if (typeof global.Response === 'undefined') {
  Object.defineProperty(global, 'Response', {
    writable: true,
    value: ResponseMock,
  });
}
