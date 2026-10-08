#!/usr/bin/env node
/**
 * Master E2E Test Runner for WPS Office Mobile Alternative
 * Executes Tier 1, Tier 2, Tier 3, and Tier 4 test suites.
 * Outputs TAP-compliant and structured console results with pass/fail statistics.
 *
 * Usage:
 *   node tests/e2e/run_all.js
 *   node tests/e2e/run_all.js --tier 1
 *   node tests/e2e/run_all.js --feature F1
 *   node tests/e2e/run_all.js --milestone M1
 *   node tests/e2e/run_all.js --bail
 *   node tests/e2e/run_all.js --verbose
 */

const fs = require('node:fs');
const path = require('node:path');
const { getRegisteredSuites, clearSuites } = require('./harness');

const E2E_ROOT = __dirname;
const TIER_DIRS = {
  1: path.join(E2E_ROOT, 'tier1_features'),
  2: path.join(E2E_ROOT, 'tier2_boundaries'),
  3: path.join(E2E_ROOT, 'tier3_combinations'),
  4: path.join(E2E_ROOT, 'tier4_realworld'),
};

// ANSI color helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tier: null,
    feature: null,
    milestone: null,
    verbose: false,
    bail: false,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--tier' && args[i + 1]) {
      options.tier = parseInt(args[++i], 10);
    } else if (arg === '--feature' && args[i + 1]) {
      options.feature = args[++i].toUpperCase();
    } else if (arg === '--milestone' && args[i + 1]) {
      options.milestone = args[++i].toUpperCase();
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--bail' || arg === '-b') {
      options.bail = true;
    } else if (arg === '--json') {
      options.json = true;
    }
  }
  return options;
}

function discoverTestFiles(options) {
  const files = [];

  const tiersToScan = options.tier ? [options.tier] : [1, 2, 3, 4];

  for (const tierNum of tiersToScan) {
    const dir = TIER_DIRS[tierNum];
    if (fs.existsSync(dir)) {
      const entries = fs.readdirSync(dir).filter((f) => f.endsWith('.test.js'));
      for (const entry of entries) {
        files.push({
          tier: tierNum,
          file: entry,
          fullPath: path.join(dir, entry),
        });
      }
    }
  }

  return files;
}

async function runTest(test, suite) {
  const startTime = Date.now();
  let error = null;

  try {
    for (const hook of suite.beforeEachHooks) {
      await hook();
    }
    if (test.fn.length > 0) {
      await new Promise((resolve, reject) => {
        test.fn((err) => (err ? reject(err) : resolve()));
      });
    } else {
      await test.fn();
    }
  } catch (err) {
    error = err;
  } finally {
    for (const hook of suite.afterEachHooks) {
      try {
        await hook();
      } catch (hookErr) {
        if (!error) error = hookErr;
      }
    }
  }

  const durationMs = Date.now() - startTime;
  return {
    title: test.title,
    metadata: test.metadata,
    passed: !error,
    error,
    durationMs,
  };
}

async function main() {
  const options = parseArgs();
  const startTime = Date.now();

  console.log(`\n${colors.bold}${colors.cyan}========================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  WPS Office Mobile Alternative - 4-Tier E2E Test Runner ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}========================================================${colors.reset}\n`);

  if (options.tier) console.log(`${colors.dim}Filtering by Tier: ${options.tier}${colors.reset}`);
  if (options.feature) console.log(`${colors.dim}Filtering by Feature: ${options.feature}${colors.reset}`);
  if (options.milestone) console.log(`${colors.dim}Filtering by Milestone: ${options.milestone}${colors.reset}`);

  clearSuites();
  const testFiles = discoverTestFiles(options);

  if (testFiles.length === 0) {
    console.log(`${colors.yellow}No test files found matching criteria.${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`${colors.dim}Discovered ${testFiles.length} test suites. Executing...\n${colors.reset}`);

  // Load all test files
  for (const { fullPath } of testFiles) {
    require(fullPath);
  }

  const allSuites = getRegisteredSuites();
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    tierBreakdown: { 1: { total: 0, passed: 0, failed: 0 }, 2: { total: 0, passed: 0, failed: 0 }, 3: { total: 0, passed: 0, failed: 0 }, 4: { total: 0, passed: 0, failed: 0 } },
    featureBreakdown: {},
    failures: [],
  };

  for (const suite of allSuites) {
    let suitePrinted = false;

    for (const hook of suite.beforeAllHooks) {
      await hook();
    }

    for (const test of suite.tests) {
      const meta = test.metadata;
      const tierNum = meta.tier || 1;
      const featureId = meta.feature || 'UNKNOWN';
      const milestoneId = meta.milestone || 'M1';

      if (options.tier && tierNum !== options.tier) continue;
      if (options.feature && featureId !== options.feature) continue;
      if (options.milestone && milestoneId !== options.milestone) continue;

      if (!suitePrinted) {
        console.log(`${colors.bold}${suite.title}${colors.reset}`);
        suitePrinted = true;
      }

      results.total++;
      if (!results.tierBreakdown[tierNum]) {
        results.tierBreakdown[tierNum] = { total: 0, passed: 0, failed: 0 };
      }
      results.tierBreakdown[tierNum].total++;

      if (!results.featureBreakdown[featureId]) {
        results.featureBreakdown[featureId] = { total: 0, passed: 0, failed: 0 };
      }
      results.featureBreakdown[featureId].total++;

      const res = await runTest(test, suite);

      if (res.passed) {
        results.passed++;
        results.tierBreakdown[tierNum].passed++;
        results.featureBreakdown[featureId].passed++;
        console.log(`  ${colors.green}✔${colors.reset} [Tier ${tierNum}][${featureId}] ${res.title} ${colors.dim}(${res.durationMs}ms)${colors.reset}`);
      } else {
        results.failed++;
        results.tierBreakdown[tierNum].failed++;
        results.featureBreakdown[featureId].failed++;
        console.log(`  ${colors.red}✖${colors.reset} [Tier ${tierNum}][${featureId}] ${res.title} ${colors.dim}(${res.durationMs}ms)${colors.reset}`);
        results.failures.push({
          suite: suite.title,
          test: res.title,
          tier: tierNum,
          feature: featureId,
          error: res.error,
        });

        if (options.bail) {
          console.log(`\n${colors.red}Bail active: terminating on first failure.${colors.reset}`);
          break;
        }
      }
    }

    for (const hook of suite.afterAllHooks) {
      await hook();
    }

    if (suitePrinted) console.log();
    if (options.bail && results.failed > 0) break;
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Failure details
  if (results.failures.length > 0) {
    console.log(`${colors.bold}${colors.red}=================== FAILURES ===================${colors.reset}\n`);
    results.failures.forEach((f, idx) => {
      console.log(`${colors.bold}${idx + 1}) [Tier ${f.tier}][${f.feature}] ${f.suite} > ${f.test}${colors.reset}`);
      console.log(`   ${colors.red}${f.error.message}${colors.reset}`);
      if (options.verbose && f.error.stack) {
        console.log(`${colors.dim}${f.error.stack}${colors.reset}`);
      }
      console.log();
    });
  }

  // Summary Report Table
  console.log(`${colors.bold}${colors.cyan}================ SUMMARY REPORT ================${colors.reset}\n`);
  console.log(`${colors.bold}Tier Breakdown:${colors.reset}`);
  console.log(`  Tier 1 (Features)     : ${results.tierBreakdown[1].passed} / ${results.tierBreakdown[1].total} passed`);
  console.log(`  Tier 2 (Boundaries)   : ${results.tierBreakdown[2].passed} / ${results.tierBreakdown[2].total} passed`);
  console.log(`  Tier 3 (Combinations) : ${results.tierBreakdown[3].passed} / ${results.tierBreakdown[3].total} passed`);
  console.log(`  Tier 4 (Real-World)   : ${results.tierBreakdown[4].passed} / ${results.tierBreakdown[4].total} passed`);

  console.log(`\n${colors.bold}Feature Breakdown:${colors.reset}`);
  const sortedFeatures = Object.keys(results.featureBreakdown).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  for (const feat of sortedFeatures) {
    const stats = results.featureBreakdown[feat];
    const statusColor = stats.failed === 0 ? colors.green : colors.red;
    console.log(`  ${feat.padEnd(6)}: ${statusColor}${stats.passed} / ${stats.total} passed${colors.reset}`);
  }

  console.log(`\n${colors.bold}Total Execution Summary:${colors.reset}`);
  console.log(`  Total Tests : ${results.total}`);
  console.log(`  Passed      : ${colors.green}${results.passed}${colors.reset}`);
  console.log(`  Failed      : ${results.failed > 0 ? colors.red + results.failed + colors.reset : '0'}`);
  console.log(`  Time        : ${totalDuration}s\n`);

  if (options.json) {
    fs.writeFileSync(
      path.join(E2E_ROOT, 'test_results.json'),
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          total: results.total,
          passed: results.passed,
          failed: results.failed,
          durationSeconds: parseFloat(totalDuration),
          tierBreakdown: results.tierBreakdown,
          featureBreakdown: results.featureBreakdown,
          failures: results.failures.map((f) => ({
            tier: f.tier,
            feature: f.feature,
            suite: f.suite,
            test: f.test,
            message: f.error.message,
          })),
        },
        null,
        2
      )
    );
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
