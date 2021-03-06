import {
  postSelectFixtureRequest,
  postUnselectFixtureRequest
} from './shared/postRequest';
import { Context, State } from './shared';

export function onRouterFixtureChange(
  context: Context,
  fixturePath: null | string
) {
  if (fixturePath === null) {
    return context.setState(emptyFixtureState, () => {
      getConnectedRendererIds(context).forEach(rendererId =>
        postUnselectFixtureRequest(context, rendererId)
      );
    });
  }

  // NOTE: The fixture state used to be reset in the local renderer state
  // before posting the "selectFixture" request, but that no longer happens.
  // Resetting renderer state when selecting a fixture makes sense in
  // abstract, but it creates an unnecessary flash of layout whenever
  // reselecting the current fixture, or when selecting a fixture of the same
  // component. By keeping the fixture state until the new fixture state is
  // received from the renderer the transition between fixtures is smoother.
  const selFixturePath = fixturePath;
  getConnectedRendererIds(context).forEach(rendererId =>
    postSelectFixtureRequest(context, rendererId, selFixturePath, null)
  );
}

function getConnectedRendererIds(context: Context) {
  return context.getState().connectedRendererIds;
}

function emptyFixtureState(prevState: State) {
  return { ...prevState, fixtureState: null };
}
