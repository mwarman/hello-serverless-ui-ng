import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable()
export class ApiGatewayService {

  AWS_SHA_256 = 'AWS4-HMAC-SHA256';
  AWS4_REQUEST = 'aws4_request';
  AWS4 = 'AWS4';
  X_AMZ_DATE = 'x-amz-date';
  X_AMZ_SECURITY_TOKEN = 'x-amz-security-token';
  HOST = 'host';
  AUTHORIZATION = 'Authorization';

  constructor() { }

  private hash(value: string): string {
    return CryptoJS.SHA256(value);
  }

  private hexEncode(value: any): string {
    return value.toString(CryptoJS.enc.Hex);
  }

  private hmac(secret: string, value: string): string {
    return CryptoJS.HmacSHA256(value, secret, { asBytes: true });
  }

  private buildCanonicalRequest(method: string, path: string, queryParams: Object | any, headers: Object | any, payload: string): string {
    return method + '\n' +
      this.buildCanonicalUri(path) + '\n' +
      this.buildCanonicalQueryString(queryParams) + '\n' +
      this.buildCanonicalHeaders(headers) + '\n' +
      this.buildCanonicalSignedHeaders(headers) + '\n' +
      this.hexEncode(this.hash(payload));
  }

  private hashCanonicalRequest(request: any): string {
    return this.hexEncode(this.hash(request));
  }

  private buildCanonicalUri(uri: string): string {
    return encodeURI(uri);
  }

  private buildCanonicalQueryString(queryParams: Object | any): string {
    if (Object.keys(queryParams).length < 1) {
      return '';
    }

    var sortedQueryParams = [];
    for (var property in queryParams) {
      if (queryParams.hasOwnProperty(property)) {
        sortedQueryParams.push(property);
      }
    }
    sortedQueryParams.sort();

    var canonicalQueryString = '';
    for (var i = 0; i < sortedQueryParams.length; i++) {
      canonicalQueryString += sortedQueryParams[i] + '=' + this.fixedEncodeURIComponent(queryParams[sortedQueryParams[i]]) + '&';
    }
    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
  }

  private fixedEncodeURIComponent(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  private buildCanonicalHeaders(headers: Object | any): string {
    var canonicalHeaders = '';
    var sortedKeys = [];
    for (var property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property);
      }
    }
    sortedKeys.sort();

    for (var i = 0; i < sortedKeys.length; i++) {
      canonicalHeaders += sortedKeys[i].toLowerCase() + ':' + headers[sortedKeys[i]] + '\n';
    }
    return canonicalHeaders;
  }

  private buildCanonicalSignedHeaders(headers: Object | any): string {
    var sortedKeys = [];
    for (var property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property.toLowerCase());
      }
    }
    sortedKeys.sort();

    return sortedKeys.join(';');
  }

  private buildStringToSign(datetime: string, credentialScope: string, hashedCanonicalRequest: string): string {
    return this.AWS_SHA_256 + '\n' +
      datetime + '\n' +
      credentialScope + '\n' +
      hashedCanonicalRequest;
  }

  private buildCredentialScope(datetime: string, region = 'us-east-1', service = 'execute-api'): string {
    return datetime.substr(0, 8) + '/' + region + '/' + service + '/' + this.AWS4_REQUEST;
  }

  private calculateSigningKey(secretKey: string, datetime: string, region = 'us-east-1', service = 'execute-api'): string {
    return this.hmac(this.hmac(this.hmac(this.hmac(this.AWS4 + secretKey, datetime.substr(0, 8)), region), service), this.AWS4_REQUEST);
  }

  private calculateSignature(key: string, stringToSign: string): string {
    return this.hexEncode(this.hmac(key, stringToSign));
  }

  private buildAuthorizationHeader(accessKey: string, credentialScope: string, headers: Object | any, signature: string): string {
    return this.AWS_SHA_256 + ' Credential=' + accessKey + '/' + credentialScope + ', SignedHeaders=' + this.buildCanonicalSignedHeaders(headers) + ', Signature=' + signature;
  }

  private copy(obj: Object | any): any {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }

  signRequest(request: Object | any, config: Object | any): Object | any {
    let verb = request.verb;
    let path = request.path;
    let queryParams = this.copy(request.queryParams);
    if (queryParams === undefined) {
      queryParams = {};
    }
    let headers = this.copy(request.headers);
    if (headers === undefined) {
      headers = {};
    }

    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = config.defaultContentType;
    }

    if (headers['Accept'] === undefined) {
      headers['Accept'] = config.defaultAcceptType;
    }

    let body = this.copy(request.body);
    if (body === undefined || body === null || verb === 'GET') {
      body = '';
    } else {
      body = JSON.stringify(body);
    }

    if (body === '' || body === undefined || body === null) {
      delete headers['Content-Type'];
    }

    let datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[:\-]|\.\d{3}/g, '');
    headers[this.X_AMZ_DATE] = datetime;
    // TODO refactor to config.host = 'dev-api.leanstacks.net'
    let parser = document.createElement('a');
    parser.href = config.endpoint;
    headers[this.HOST] = parser.hostname;

    let canonicalRequest = this.buildCanonicalRequest(verb, path, queryParams, headers, body);
    let hashedCanonicalRequest = this.hashCanonicalRequest(canonicalRequest);
    let credentialScope = this.buildCredentialScope(datetime, config.region, config.serviceName);
    let stringToSign = this.buildStringToSign(datetime, credentialScope, hashedCanonicalRequest);
    let signingKey = this.calculateSigningKey(config.secretKey, datetime, config.region, config.serviceName);
    let signature = this.calculateSignature(signingKey, stringToSign);
    headers[this.AUTHORIZATION] = this.buildAuthorizationHeader(config.accessKey, credentialScope, headers, signature);
    if (config.sessionToken !== undefined && config.sessionToken !== '') {
      headers[this.X_AMZ_SECURITY_TOKEN] = config.sessionToken;
    }
    delete headers[this.HOST];

    let url = config.endpoint + path;
    let queryString = this.buildCanonicalQueryString(queryParams);
    if (queryString != '') {
      url += "?" + queryString;
    }

    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = config.defaultContentType;
    }

    return {
      method: verb,
      url,
      headers,
      body
    };
  }

}
