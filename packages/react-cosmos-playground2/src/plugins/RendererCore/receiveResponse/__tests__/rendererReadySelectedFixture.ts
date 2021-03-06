import { wait } from 'react-testing-library';
import { PluginContext, loadPlugins } from 'react-plugin';
import { RendererId, RendererRequest } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  on,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { createRendererReadyResponse } from '../../testHelpers';
import { State } from '../../shared';
import { RendererCoreSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixturePath = 'ein.js';
const fixtures = [fixturePath];
const fixtureState = { components: [] };

function registerTestPlugins(
  handleRendererRequest: (
    context: PluginContext<any>,
    msg: RendererRequest
  ) => void
) {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath })
  });
  on<RendererCoreSpec>('rendererCore', {
    request: handleRendererRequest
  });
}

function loadTestPlugins(state?: State) {
  loadPlugins({ state: { rendererCore: state } });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.receiveResponse(createRendererReadyResponse(rendererId, fixtures));
}

it('posts "selectFixture" renderer request', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins(handleRendererRequest);

  loadTestPlugins();
  mockRendererReadyResponse('mockRendererId');

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixturePath,
        fixtureState: null
      }
    })
  );
});

it('posts "selectFixture" renderer request with fixture state', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins(handleRendererRequest);

  loadTestPlugins({
    connectedRendererIds: ['mockRendererId1'],
    primaryRendererId: 'mockRendererId1',
    fixtures,
    fixtureState
  });
  mockRendererReadyResponse('mockRendererId2');

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixturePath,
        fixtureState
      }
    })
  );
});
