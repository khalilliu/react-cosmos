import { StateUpdater } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  RendererId,
  FixtureNames,
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';

export type RendererCoreSpec = {
  name: 'rendererCore';
  config: {
    webUrl: null | string;
    enableRemote: boolean;
  };
  state: {
    connectedRendererIds: RendererId[];
    primaryRendererId: null | RendererId;
    fixtures: FixtureNames;
    fixtureState: null | FixtureState;
  };
  methods: {
    getWebUrl(): null | string;
    remoteRenderersEnabled(): boolean;
    getConnectedRendererIds(): RendererId[];
    getPrimaryRendererId(): null | RendererId;
    getFixtures(): FixtureNames;
    getFixtureState(): null | FixtureState;
    isRendererConnected(): boolean;
    isValidFixtureSelected(): boolean;
    setFixtureState(stateChange: StateUpdater<null | FixtureState>): void;
    selectPrimaryRenderer(primaryRendererId: RendererId): void;
    receiveResponse(msg: RendererResponse): void;
  };
  events: {
    request: (msg: RendererRequest) => void;
  };
};
