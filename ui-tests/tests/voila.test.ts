// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { expect, test } from '@playwright/test';
import { addBenchmarkToTest } from './utils';

test.describe('Voila performance Tests', () => {
  test.beforeEach(({ page }) => {
    page.setDefaultTimeout(120000);
  });
  test.afterEach(async ({ page, browserName }) => {
    await page.close({ runBeforeUnload: true });
  });
  test('Render and benchmark basics.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'basics';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      // wait for the widgets to load
      // await page.waitForSelector('.jupyter-widgets');
      await page.waitForSelector('span[role="presentation"] >> text=x');
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    // change the value of the slider
    await page.fill('text=4.00', '8.00');
    await page.keyboard.down('Enter');
    // fetch the value of the label
    const value = await page.$eval('input', el => el.value);

    expect(value).toBe('64');
    // wait for the final MathJax message to be hidden
    await page.$('text=Typesetting math: 100%');
    await page.waitForSelector('#MathJax_Message', { state: 'hidden' });
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });

  test('Render and benchmark bqplot.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'bqplot';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector('svg.svg-figure');
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });

  test('Render and benchmark dashboard.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'dashboard';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector('svg.svg-figure');
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    const title = await page.$$('text.mainheading');
    expect(title).toHaveLength(2);
    expect(await title[0].innerHTML()).toEqual('Histogram');
    expect(await title[1].innerHTML()).toEqual('Line Chart');
  });

  test('Render and benchmark gridspecLayout.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'gridspecLayout';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector(
        'button.jupyter-widgets.jupyter-button.widget-button >> text=10'
      );
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });

  test('Render and benchmark interactive.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'interactive';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector('div.widget-slider.widget-hslider');
      await page.fill('div.widget-readout', '8.00');
      await page.keyboard.down('Enter');
      await page.fill('div.widget-readout >> text=0', '8.00');
      await page.keyboard.down('Enter');
      await page.mouse.click(0, 0);
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });

  test('Render and benchmark ipympl.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'ipympl';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector('div.jupyter-matplotlib-figure');
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });

  test('Render and benchmark ipyvolume.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'ipyvolume';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector('canvas');
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });

  test('Benchmark the multiple widgets notebook', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'multiple_widgets';
    const testMultipleWidget = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector(
        'button.jupyter-widgets.jupyter-button.widget-button >> text=400'
      );
    };
    await addBenchmarkToTest(
      notebookName,
      testMultipleWidget,
      testInfo,
      browserName
    );
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });
  test('Render and benchmark query-strings.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'query-strings';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      const userName = await page.$$(
        'div.jp-RenderedText.jp-OutputArea-output > pre'
      );
      expect(await userName[1].innerHTML()).toContain('Hi Kim');
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    await page.goto(`render/${notebookName}.ipynb?username=Riley`);
    const userName = await page.$$(
      'div.jp-RenderedText.jp-OutputArea-output > pre'
    );
    expect(await userName[1].innerHTML()).toContain('Hi Riley');
    await page.$('text=Typesetting math: 100%');
    await page.waitForSelector('#MathJax_Message', { state: 'hidden' });
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });
  test('Render and benchmark reveal.ipynb', async ({
    page,
    browserName
  }, testInfo) => {
    const notebookName = 'reveal';
    const testFunction = async () => {
      await page.goto(`render/${notebookName}.ipynb`);
      await page.waitForSelector('span[role="presentation"] >> text=x');
    };
    await addBenchmarkToTest(notebookName, testFunction, testInfo, browserName);
    expect(await page.screenshot()).toMatchSnapshot(`${notebookName}.png`);
  });
});
