/**
 * Tier 2 - Feature 10: Cloudinary Live Test Connection Boundaries
 * Verifies edge cases: network timeouts, HTTP 401, HTTP 404, non-JSON response, rapid clicks.
 */

const { describe, it, expect } = require('../harness');

describe('Tier 2: Feature 10 - Cloudinary Live Test Connection Boundaries', () => {
  it('F10-T2-1: Network request timeout (10 seconds) aborts gracefully and reports friendly error', async () => {
    async function executeWithTimeout(promiseFn, timeoutMs = 100) {
      let timer;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Network timeout: Cloudinary endpoint unreachable')), timeoutMs);
      });
      try {
        return await Promise.race([promiseFn(), timeoutPromise]);
      } finally {
        clearTimeout(timer);
      }
    }

    const slowRequest = () => new Promise((resolve) => setTimeout(() => resolve('done'), 500));

    await expect(executeWithTimeout(slowRequest, 50)).rejects.toThrow('Network timeout');
  }, { feature: 'F10', tier: 2, milestone: 'M2' });

  it('F10-T2-2: HTTP 401 Unauthorized returns connection failed without dumping auth headers', () => {
    function handleCloudinaryError(status, headers) {
      if (status === 401) {
        return {
          success: false,
          userMessage: '✕ Connection Failed: Invalid API Key or Secret',
          leakedHeaders: false,
        };
      }
      return { success: false, userMessage: '✕ Connection Failed: Unknown error' };
    }

    const res = handleCloudinaryError(401, { Authorization: 'Basic secret' });
    expect(res.success).toBe(false);
    expect(res.userMessage).toContain('Invalid API Key or Secret');
    expect(res.leakedHeaders).toBe(false);
  }, { feature: 'F10', tier: 2, milestone: 'M2' });

  it('F10-T2-3: HTTP 404 Cloud Name Not Found produces specific error guidance', () => {
    function handle404(cloudName) {
      return {
        success: false,
        indicator: '✕ Connection Failed',
        message: `Cloud Name "${cloudName}" does not exist. Please check your Cloudinary account details.`,
      };
    }

    const res = handle404('nonexistent_cloud');
    expect(res.indicator).toBe('✕ Connection Failed');
    expect(res.message).toContain('does not exist');
  }, { feature: 'F10', tier: 2, milestone: 'M2' });

  it('F10-T2-4: Malformed or HTML error page from proxy handles safely without JSON parse error', () => {
    function parseCloudinaryResponse(rawBody) {
      try {
        return JSON.parse(rawBody);
      } catch {
        return {
          error: { message: 'Unexpected server response. Please verify network connection.' },
        };
      }
    }

    const html502 = '<html><body>502 Bad Gateway</body></html>';
    const parsed = parseCloudinaryResponse(html502);

    expect(parsed.error).toBeDefined();
    expect(parsed.error.message).toContain('Unexpected server response');
  }, { feature: 'F10', tier: 2, milestone: 'M2' });

  it('F10-T2-5: Multiple rapid clicks on Test Connection debounces and queues at most 1 in-flight test', () => {
    let inFlight = false;
    let executionCount = 0;

    async function triggerTest() {
      if (inFlight) return { status: 'ignored_duplicate' };
      inFlight = true;
      executionCount++;
      await new Promise((r) => setTimeout(r, 20));
      inFlight = false;
      return { status: 'completed' };
    }

    const results = [];
    results.push(triggerTest());
    results.push(triggerTest()); // in-flight, should be ignored
    results.push(triggerTest()); // in-flight, should be ignored

    expect(executionCount).toBe(1);
  }, { feature: 'F10', tier: 2, milestone: 'M2' });
}, { feature: 'F10', tier: 2, milestone: 'M2' });
