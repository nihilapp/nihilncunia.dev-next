import axios, {
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';

import { type ApiResponse } from '@/_entities/common/common.types';

import { siteConfig } from '../../_config';

export class ApiHelper {
  private static baseURL = siteConfig.apiRoute;

  private static config: AxiosRequestConfig = {
    withCredentials: true,
    baseURL: this.baseURL,
    headers: { 'Content-Type': 'application/json', },
  };

  static createInstance() {
    return axios.create(this.config);
  }

  static async get<T>(
    restApi: string,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().get<ApiResponse<T>>(
      restApi,
      config
    );
  }

  static async post<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().post<T, AxiosResponse<ApiResponse<T>, P>, P>(
      restApi,
      data,
      config
    );
  }

  static async postWithFile<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().post<T, AxiosResponse<ApiResponse<T>, P>, P>(
      restApi,
      data,
      {
        ...config,
        headers: { 'Content-Type': 'multipart/form-data', },
      }
    );
  }

  static async patch<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().patch<T, AxiosResponse<ApiResponse<T>, P>, P>(
      restApi,
      data,
      config
    );
  }

  static async put<T, P>(
    restApi: string,
    data: P,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().put<T, AxiosResponse<ApiResponse<T>, P>, P>(
      restApi,
      data,
      config
    );
  }

  static async delete<T>(
    restApi: string,
    config?: AxiosRequestConfig
  ) {
    return this.createInstance().delete<ApiResponse<T>>(
      restApi,
      config
    );
  }

  static async getQuery<D>(url: string) {
    const { data, } = await this.get<D>(url);

    return data;
  }

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

  static async deleteQuery<D>(url: string) {
    const { data, } = await this.delete<D>(url);

    return data;
  }

  static async deleteWithDataQuery<D, P>(
    url: string,
    postData: P
  ) {
    const { data, } = await this.delete<D>(
      url,
      { data: postData, }
    );

    return data;
  }

  static async deletesQuery<D, P>(url: string, deleteData: P) {
    const { data, } = await this.delete<D>(
      url,
      { data: deleteData, }
    );

    return data;
  }
}
