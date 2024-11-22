# endpointx API Client Documentation

This guide demonstrates how to integrate and use the endpointx library to make HTTP requests with retry logic, caching, and custom headers in your React app.

# 1. Installation
To get started, you need to install the endpointx library in your project.

```bash
npm install endpointx
```


# 2. Basic Setup
To use endpointx in your project, you need to instantiate the Apic class and configure it. The client supports retry logic, caching, and the ability to set custom headers.

```tsx
import Apic from 'endpointx';

const apiClient = new Apic({
  enableCache: true,          // Enables caching for requests
  cacheExpirationTime: 5 * 60 * 1000, // Default: 5 minutes
  enableRetry: true,          // Enables retry logic on failure
  retries: 3,                 // Number of retries on failure
  retryDelay: 3000,           // Delay between retries (in milliseconds)
  timeout: 5000,              // Timeout for each request (in milliseconds)
});
```

# 3. Setting Custom Headers
You can set custom headers globally for all requests made by the apiClient. This is useful for headers like Authorization, Content-Type, or any other custom headers required for authentication or request processing.

```tsx
// Set custom headers globally
apiClient.setHeaders({
  'Authorization': 'Bearer your-auth-token',
  'Content-Type': 'application/json',
});
```

Alternatively, you can pass headers for specific requests. This will override the global headers for that particular request.

```tsx
// Send custom headers with an individual request
const response = await apiClient.get('https://jsonplaceholder.typicode.com/posts', {
  headers: {
    'X-Custom-Header': 'CustomHeaderValue', // Specific to this request
  }
});
```

# 4. Making API Requests
With endpointx, making GET, POST, PUT, and DELETE requests is straightforward.

***GET Request***
Fetch data from a given endpoint.

```tsx
const fetchData = async () => {
  try {
    const response = await apiClient.get('https://jsonplaceholder.typicode.com/posts');
    console.log(response);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};
```

***POST Request***
Post data to a given endpoint.

```tsx
const postData = async () => {
  try {
    const response = await apiClient.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
    });
    console.log(response);
  } catch (err) {
    console.error('Error posting data:', err);
  }
};
```

***PUT Request***
Update data at a specific endpoint.

```tsx
const putData = async () => {
  try {
    const response = await apiClient.put('https://jsonplaceholder.typicode.com/posts/1', {
      title: 'Updated Title',
      body: 'Updated Body',
      userId: 1,
    });
    console.log(response);
  } catch (err) {
    console.error('Error updating data:', err);
  }
};
```

***DELETE Request***
Delete data from a given endpoint.

```tsx
const deleteData = async () => {
  try {
    const response = await apiClient.delete('https://jsonplaceholder.typicode.com/posts/1');
    console.log(response);
  } catch (err) {
    console.error('Error deleting data:', err);
  }
};
```

# 5. Retry Logic and Caching
endpointx automatically handles retries and caching based on the configuration:

* Retries: If a request fails, the client will retry the request for a 
* specified number of retries (retries) with a delay (retryDelay) between  attempts.
* Caching: Responses are cached automatically if enableCache is set to true, 
* helping to reduce redundant network requests.

# 6. Handling Errors
The apiClient provides basic error handling by catching errors during requests. You can customize how errors are handled in your application.

```tsx
try {
  const response = await apiClient.get('https://jsonplaceholder.typicode.com/posts');
  console.log(response);
} catch (err) {
  // Handle the error based on the type of error
  if (err.response) {
    console.error('Response error:', err.response);
  } else if (err.request) {
    console.error('Request error:', err.request);
  } else {
    console.error('Unexpected error:', err.message);
  }
}
```

# 7. Retrieving Cached Data
You can retrieve cached data by calling the getCache method on the API client. This method checks if the data for a specific endpoint is already available in the cache. If cached data exists, it will return that data; otherwise, it will return null.

```tsx
// Function to manually check if data is cached
const checkCache = async () => {
  try {
    const cachedData = apiClient.getCache('https://jsonplaceholder.typicode.com/posts');
    if (cachedData) {
      console.log('Cached Data:', cachedData);
    } else {
      console.log('No cached data found for this endpoint');
    }
  } catch (err) {
    console.error('Error checking cache:', err);
  }
};
```

# 8. Fetching Data with Cache
The client will automatically check the cache before making a new network request if caching is enabled. For example, if you call apiClient.get() to fetch data from the same endpoint, it will first check the cache and use cached data if available.

```tsx
// Function to manually check if data is cached
const fetchData = async () => {
  try {
    const response = await apiClient.get('https://jsonplaceholder.typicode.com/posts');
    console.log('Fetched Data:', response);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};
```

# 9. Cache Expiration and Management
Cached data is typically stored in memory until a new request is made that overwrites the cache. The data may be invalidated or expire based on the configuration and cache settings.

You can manage cache expiration by configuring the cache with an expiration time or clearing the cache manually if needed.

For example, to clear the cache for a specific endpoint, you can call:

```tsx
apiClient.clearCache('https://jsonplaceholder.typicode.com/posts');
```

# 10. Full Example
Here’s a full example that combines fetching data, posting data, and using custom headers.

```tsx
import React, { useState } from 'react';
import Apic from 'endpointx';

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const apiClient = new Apic({
    enableCache: true,
    enableRetry: true,
    retries: 3,
    retryDelay: 3000,
    timeout: 5000,
  });

  // Set global headers
  apiClient.setHeaders({
    'Authorization': 'Bearer your-auth-token',
    'Content-Type': 'application/json',
  });

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await apiClient.get('https://jsonplaceholder.typicode.com/posts');
      setData(response);
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <h1>API Client Test</h1>
      <button onClick={fetchData} disabled={refreshing}>Fetch Data</button>
      {refreshing && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
```

# 11. Conclusion
endpointx is a powerful and flexible API client that supports retry logic, caching, and custom headers, making it ideal for managing API requests in React applications. By configuring global headers and handling retries, you can build robust and efficient applications that handle network failures gracefully and avoid redundant API calls.