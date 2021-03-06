import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { createFixtureAction } from '../RendererHeader/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { ResponsivePreviewSpec } from './public';
import { ResponsivePreview } from './ResponsivePreview';
import { Context, DEFAULT_DEVICES } from './shared';
import { Props as ToggleButtonProps, ToggleButton } from './ToggleButton';

const { plug, register } = createPlugin<ResponsivePreviewSpec>({
  name: 'responsivePreview',
  defaultConfig: {
    devices: DEFAULT_DEVICES
  },
  initialState: {
    enabled: false,
    viewport: null
  }
});

plug({
  slotName: 'rendererPreviewOuter',
  render: ResponsivePreview,
  getProps: context => {
    const { fullScreen } = context
      .getMethodsOf<RouterSpec>('router')
      .getUrlParams();

    return {
      ...getCommonProps(context),
      config: context.getConfig(),
      fullScreen: fullScreen !== undefined
    };
  }
});

plug({
  slotName: 'fixtureActions',
  render: createFixtureAction<ToggleButtonProps>(ToggleButton),
  getProps: context => getCommonProps(context)
});

export { register };

function getCommonProps(context: Context) {
  const { getState, setState, getMethodsOf } = context;

  const core = getMethodsOf<CoreSpec>('core');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  return {
    state: getState(),
    projectId: core.getProjectId(),
    fixtureState: rendererCore.getFixtureState(),
    validFixtureSelected: rendererCore.isValidFixtureSelected(),
    setState,
    setFixtureStateViewport: () => setFixtureStateViewport(context),
    storage: getStorageApi(context)
  };
}

function getStorageApi({ getMethodsOf }: Context) {
  return getMethodsOf<StorageSpec>('storage');
}

function setFixtureStateViewport({ getState, getMethodsOf }: Context) {
  const { enabled, viewport } = getState();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  rendererCore.setFixtureState(fixtureState => ({
    ...fixtureState,
    // TODO: Make fixtureState.components optional and remove this
    components: fixtureState ? fixtureState.components : [],
    viewport: enabled ? viewport : null
  }));
}
