import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { useState } from 'react';
import Accordion from '@Components/accordion/accordion.components';
import { ReactComponent as BriefcaseSVG } from '@SVG/briefcase.svg';
import { ReactComponent as SearchSVG } from '@SVG/search.svg';
import UpTabsStyle from './upTabs.module.css';
const UpTabs = () => {
	const [title, setTitle] = useState('Add New Hiring Requests');
	return (
		<div>
			<Tabs>
				<TabList>
					<Tab>Active HRs</Tab>
					<Tab>Snooze HRs</Tab>
				</TabList>

				<TabPanel>
					<div className={UpTabsStyle.searchWrapper}>
						<span>
							<SearchSVG />
						</span>
						<input
							type="search"
							name="search"
							placeholder="Search"
						/>
					</div>
					<div className={UpTabsStyle.chatListWrapper}>
						<Accordion
							icon={<BriefcaseSVG />}
							label={'All Channels'}
							isCollapsible={true}
						/>
					</div>
				</TabPanel>
				<TabPanel>
					<h2>Any content 2</h2>
				</TabPanel>
			</Tabs>
		</div>
	);
};

export default UpTabs;
