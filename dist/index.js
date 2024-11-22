'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// cache.ts
const cache = new Map();

const defaultConfig = {
  enableCache: true,
  cacheExpirationTime: 5 * 60 * 1000,
  // Default: 5 minutes
  enableRetry: true,
  retries: 3,
  retryDelay: 1000,
  // Default: 1 second
  timeout: 30000 // Timeout after 30 seconds
};

// headers.ts
function buildHeaders(contentType, authToken) {
  const headers = {
    'Content-Type': contentType
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

function refreshData() {
  return __awaiter(this, void 0, void 0, function* () {
    console.log("Refreshing data...");
    // Implement your refresh logic here, e.g., re-authentication, refreshing tokens, etc.
  });
}

function withRetry(operation_1, retries_1, delay_1) {
  return __awaiter(this, arguments, void 0, function* (operation, retries, delay, refreshLimit = 3 // Default refresh limit if retries exceed
  ) {
    let attempt = 0;
    let refreshAttempts = 0;
    while (attempt <= retries) {
      try {
        // Attempt the operation
        console.log(`Attempt ${attempt + 1} of ${retries + 1}`);
        return yield operation();
      } catch (error) {
        attempt++;
        console.warn(`Attempt ${attempt} failed. ${retries - attempt} retries left.`);
        if (attempt <= retries) {
          // Retry with delay
          console.log('Retrying operation...');
          yield new Promise(resolve => setTimeout(resolve, delay));
        }
        // If retry count exceeded and refresh limit is available, refresh request
        if (attempt > retries && refreshAttempts < refreshLimit) {
          console.log("Maximum retry limit reached. Refreshing...");
          refreshAttempts++;
          yield refreshData(); // Use the local refreshData function
        }
      }
    }
    // Throw error after retries are exhausted
    throw new Error('Max retries exceeded. Operation failed.');
  });
}

function deleteData(url_1, authToken_1) {
  return __awaiter(this, arguments, void 0, function* (url, authToken, config = {}, timeout = 5000 // Default timeout: 5 seconds
  ) {
    const finalConfig = Object.assign(Object.assign({}, defaultConfig), config);
    const operation = () => __awaiter(this, void 0, void 0, function* () {
      const responseOrError = yield Promise.race([fetch(url, {
        method: 'DELETE',
        headers: buildHeaders('application/json', authToken)
      }), new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))]);
      if (responseOrError instanceof Error) {
        throw responseOrError; // Timeout or other error
      }
      const response = responseOrError;
      if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
      return response.json();
    });
    return finalConfig.enableRetry ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay) : operation();
  });
}

function fetchData(url_1, authToken_1) {
  return __awaiter(this, arguments, void 0, function* (url, authToken, config = {}, timeout = 5000 // Default timeout: 5 seconds
  ) {
    const finalConfig = Object.assign(Object.assign({}, defaultConfig), config);
    const operation = () => __awaiter(this, void 0, void 0, function* () {
      if (finalConfig.enableCache) {
        const cachedData = cache.get(url);
        if (cachedData && Date.now() - cachedData.timestamp < finalConfig.cacheExpirationTime) {
          console.log('Returning cached data');
          return cachedData.data;
        }
      }
      const responseOrError = yield Promise.race([fetch(url, {
        method: 'GET',
        headers: buildHeaders('application/json', authToken)
      }), new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))]);
      if (responseOrError instanceof Error) {
        throw responseOrError; // Timeout or other error
      }
      // Now we can safely access Response properties
      const response = responseOrError;
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = yield response.json();
      if (finalConfig.enableCache) cache.set(url, {
        data,
        timestamp: Date.now()
      });
      return data;
    });
    // Track retries using withRetry function
    return finalConfig.enableRetry ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay) : operation();
  });
}

function postData(url_1, body_1, authToken_1) {
  return __awaiter(this, arguments, void 0, function* (url, body, authToken, contentType = 'application/json', config = {}, timeout = 5000 // Default timeout: 5 seconds
  ) {
    const finalConfig = Object.assign(Object.assign({}, defaultConfig), config);
    const operation = () => __awaiter(this, void 0, void 0, function* () {
      const responseOrError = yield Promise.race([fetch(url, {
        method: 'POST',
        headers: buildHeaders(contentType, authToken),
        body: JSON.stringify(body)
      }), new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))]);
      if (responseOrError instanceof Error) {
        throw responseOrError; // Timeout or other error
      }
      const response = responseOrError;
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    });
    return finalConfig.enableRetry ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay) : operation();
  });
}

function putOrPatchData(method_1, url_1, body_1, authToken_1) {
  return __awaiter(this, arguments, void 0, function* (method, url, body, authToken, contentType = 'application/json', config = {}, timeout = 5000 // Default timeout: 5 seconds
  ) {
    const finalConfig = Object.assign(Object.assign({}, defaultConfig), config);
    const operation = () => __awaiter(this, void 0, void 0, function* () {
      const responseOrError = yield Promise.race([fetch(url, {
        method,
        headers: buildHeaders(contentType, authToken),
        body: JSON.stringify(body)
      }), new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))]);
      if (responseOrError instanceof Error) {
        throw responseOrError; // Timeout or other error
      }
      const response = responseOrError;
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    });
    return finalConfig.enableRetry ? withRetry(operation, finalConfig.retries, finalConfig.retryDelay) : operation();
  });
}

// apic.ts
class Apic {
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, defaultConfig), config);
  }
  // GET request
  get(url, authToken) {
    return __awaiter(this, void 0, void 0, function* () {
      return fetchData(url, authToken, this.config);
    });
  }
  // POST request
  post(url_1, body_1, authToken_1) {
    return __awaiter(this, arguments, void 0, function* (url, body, authToken, contentType = 'application/json') {
      return postData(url, body, authToken, contentType, this.config);
    });
  }
  // PUT request
  put(url_1, body_1, authToken_1) {
    return __awaiter(this, arguments, void 0, function* (url, body, authToken, contentType = 'application/json') {
      return putOrPatchData('PUT', url, body, authToken, contentType, this.config);
    });
  }
  // PATCH request
  patch(url_1, body_1, authToken_1) {
    return __awaiter(this, arguments, void 0, function* (url, body, authToken, contentType = 'application/json') {
      return putOrPatchData('PATCH', url, body, authToken, contentType, this.config);
    });
  }
  // DELETE request
  delete(url, authToken) {
    return __awaiter(this, void 0, void 0, function* () {
      return deleteData(url, authToken, this.config);
    });
  }
  // Set or update configuration
  setConfig(config) {
    this.config = Object.assign(Object.assign({}, this.config), config);
  }
  // Get current configuration
  getConfig() {
    return this.config;
  }
  // Access cache directly
  getCache() {
    return cache;
  }
}

module.exports = Apic;
//# sourceMappingURL=index.js.map
