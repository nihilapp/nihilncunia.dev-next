import axios, {
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';

import { type SuccessPayload } from '@/_entities/common';

import { siteConfig } from '../../_config';

/**
 * HTTP 클라이언트 유틸리티
 * Axios 기반의 API 요청을 위한 헬퍼 클래스
 */
export class Api {
  private static baseURL = siteConfig.baseApiUrl;

  private static config: AxiosRequestConfig = {
    withCredentials: true,
    baseURL: this.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  /**
   * Axios 인스턴스를 생성합니다.
   */
  static createInstance() {
    const instance = axios.create(this.config);

    return instance;
  }

  /**
   * GET 요청을 수행합니다.
   */
  static async get<T>(
    restApi: string,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().get<SuccessPayload<T>>(
      restApi,
      config
    );
  }

  /**
   * POST 요청을 수행합니다.
   */
  static async post<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().post<T, AxiosResponse<SuccessPayload<T>, P>, P>(
      restApi,
      data,
      config
    );
  }

  /**
   * 파일 업로드를 위한 POST 요청을 수행합니다.
   */
  static async postWithFile<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().post<T, AxiosResponse<SuccessPayload<T>, P>, P>(
      restApi,
      data,
      {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  /**
   * PATCH 요청을 수행합니다.
   */
  static async patch<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().patch<T, AxiosResponse<SuccessPayload<T>, P>, P>(
      restApi,
      data,
      config
    );
  }

  /**
   * PUT 요청을 수행합니다.
   */
  static async put<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().put<T, AxiosResponse<SuccessPayload<T>, P>, P>(
      restApi,
      data,
      config
    );
  }

  /**
   * DELETE 요청을 수행합니다.
   */
  static async delete<T>(
    restApi: string,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().delete<SuccessPayload<T>>(
      restApi,
      config
    );
  }

  /**
   * GET 요청을 수행하고 응답 데이터만 반환합니다.
   */
  static async getQuery<D>(url: string) {
    const { data, } = await this.get<D>(url);

    return data;
  }

  /**
   * POST 요청을 수행하고 응답 데이터만 반환합니다.
   */
  static async postQuery<D, P>(
    url: string,
    postData: P
  ) {
    const { data, } = await this.post<D, P>(
      url,
      postData
    );
    return data;
  }

  /**
   * POST 요청을 수행하고 응답 데이터만 반환합니다. (스마트 타입 추론)
   * 반환 타입만 지정하면 요청 데이터 타입은 자동으로 추론됩니다.
   */
  static async postData<D>(
    url: string,
    postData?: unknown
  ): Promise<SuccessPayload<D>>;
  static async postData<D, P>(
    url: string,
    postData: P
  ): Promise<SuccessPayload<D>>;
  static async postData<D, P = unknown>(
    url: string,
    postData: P
  ) {
    const { data, } = await this.post<D, P>(
      url,
      postData
    );
    return data;
  }

  /**
   * PATCH 요청을 수행하고 응답 데이터만 반환합니다. (스마트 타입 추론)
   */
  static async patchData<D, P = unknown>(
    url: string,
    patchData: P
  ) {
    const { data, } = await this.patch<D, P>(
      url,
      patchData
    );
    return data;
  }

  /**
   * PUT 요청을 수행하고 응답 데이터만 반환합니다. (스마트 타입 추론)
   */
  static async putData<D, P = unknown>(
    url: string,
    putData: P
  ) {
    const { data, } = await this.put<D, P>(
      url,
      putData
    );
    return data;
  }

  /**
   * PATCH 요청을 수행하고 응답 데이터만 반환합니다.
   */
  static async patchQuery<D, P>(
    url: string,
    patchData: P
  ) {
    const { data, } = await this.patch<D, P>(
      url,
      patchData
    );

    return data;
  }

  /**
   * PUT 요청을 수행하고 응답 데이터만 반환합니다.
   */
  static async putQuery<D, P>(
    url: string,
    putData: P
  ) {
    const { data, } = await this.put<D, P>(
      url,
      putData
    );

    return data;
  }

  /**
   * DELETE 요청을 수행하고 응답 데이터만 반환합니다.
   */
  static async deleteQuery<D>(url: string) {
    const { data, } = await this.delete<D>(url);

    return data;
  }

  /**
   * 데이터와 함께 DELETE 요청을 수행하고 응답 데이터만 반환합니다.
   */
  static async deleteWithDataQuery<D, P>(
    url: string,
    postData: P
  ) {
    const { data, } = await this.delete<D>(
      url,
      {
        data: postData,
      }
    );

    return data;
  }

  /**
   * 여러 데이터를 삭제하는 DELETE 요청을 수행하고 응답 데이터만 반환합니다.
   */
  static async deletesQuery<D, P>(url: string, deleteData: P) {
    const { data, } = await this.delete<D>(
      url,
      {
        data: deleteData,
      }
    );

    return data;
  }
}
