import { UIKitIncomingInteractionContainerType } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionContainer';
import {
	UiKitMessage,
	UiKitComponent,
	kitContext,
	messageParser,
} from '@rocket.chat/fuselage-ui-kit';
import React, { useRef, useEffect } from 'react';

import * as ActionManager from '../../../app/ui-message/client/ActionManager';
import { renderMessageBody } from '../../lib/renderMessageBody';
import './textParsers';

// TODO: move this to fuselage-ui-kit itself
const mrkdwn = ({ text } = {}) =>
	text && <span dangerouslySetInnerHTML={{ __html: renderMessageBody({ msg: text }) }} />;

messageParser.mrkdwn = mrkdwn;
function MessageBlock({ mid: _mid, rid, blocks, appId }) {
	const context = {
		action: ({ actionId, value, blockId, mid = _mid }) => {
			ActionManager.triggerBlockAction({
				blockId,
				actionId,
				value,
				mid,
				rid,
				appId: blocks[0].appId,
				container: {
					type: UIKitIncomingInteractionContainerType.MESSAGE,
					id: mid,
				},
			});
		},
		appId,
		rid,
	};

	const ref = useRef();
	useEffect(() => {
		ref.current.dispatchEvent(new Event('rendered'));
	}, []);

	return (
		<kitContext.Provider value={context}>
			<div className='js-block-wrapper' ref={ref} />
			<UiKitComponent render={UiKitMessage} blocks={blocks} />
		</kitContext.Provider>
	);
}

export default MessageBlock;
