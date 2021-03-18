import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ColumnLayout from '@splunk/react-ui/ColumnLayout';
import Select from '@splunk/react-ui/Select';
import Button from '@splunk/react-ui/Button';
import Paginator from '@splunk/react-ui/Paginator';
import { _ } from '@splunk/ui-utils/i18n';

import TableFilter from './TableFilter';
import TableContext from '../../context/TableContext';
import { TableCaptionComponent, TableSelectBoxWrapper } from './CustomTableStyle';

function TableHeader({ page, services, totalElement, handleRequestModalOpen }) {
    const {
        pageSize,
        currentPage,
        setCurrentPage,
        setPageSize,
        searchType,
        setSearchType,
        setSearchText,
    } = useContext(TableContext);
    const getSearchTypeDropdown = () => {
        let arr = [];
        arr = services.map((service) => {
            return <Select.Option key={service.name} label={service.title} value={service.name} />;
        });

        arr.unshift(<Select.Option key="all" label={_('All')} value="all" />);
        return arr;
    };
    return page === 'inputs' ? (
        <ColumnLayout gutter={8}>
            <ColumnLayout.Row
                style={{
                    borderTop: '1px solid #e1e6eb',
                    padding: '5px 0px',
                    marginTop: '25px',
                }}
            >
                <ColumnLayout.Column span={4}>
                    <TableCaptionComponent>
                        <div>
                            {totalElement}
                            {totalElement > 1 ? _(' Inputs') : _(' Input')}
                            <TableSelectBoxWrapper>
                                <Select
                                    value={pageSize}
                                    onChange={(e, { value }) => {
                                        setCurrentPage(0);
                                        setPageSize(value);
                                    }}
                                >
                                    <Select.Option key="10" label="10 Per Page" value={10} />
                                    <Select.Option key="25" label="25 Per Page" value={25} />
                                    <Select.Option key="50" label="50 Per Page" value={50} />
                                </Select>
                                <Select
                                    value={searchType}
                                    onChange={(e, { value }) => {
                                        setCurrentPage(0);
                                        setSearchType(value);
                                    }}
                                >
                                    {getSearchTypeDropdown()}
                                </Select>
                            </TableSelectBoxWrapper>
                        </div>
                    </TableCaptionComponent>
                </ColumnLayout.Column>
                <ColumnLayout.Column span={4}>
                    <TableFilter
                        handleChange={(e, { value }) => {
                            setCurrentPage(0);
                            setSearchText(value);
                        }}
                    />
                </ColumnLayout.Column>
                <ColumnLayout.Column
                    span={4}
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Paginator
                        onChange={(e, { page }) => setCurrentPage(page - 1)}
                        current={currentPage + 1}
                        alwaysShowLastPageLink
                        totalPages={Math.ceil(totalElement / pageSize)}
                        style={{
                            marginRight: '30px',
                        }}
                    />
                </ColumnLayout.Column>
            </ColumnLayout.Row>
        </ColumnLayout>
    ) : (
        <ColumnLayout gutter={8}>
            <ColumnLayout.Row
                style={{
                    padding: '5px 0px',
                }}
            >
                <ColumnLayout.Column span={4}>
                    <TableCaptionComponent>
                        <div>
                            {totalElement}
                            {totalElement > 1 ? _(' Items') : _(' Items')}
                        </div>
                    </TableCaptionComponent>
                </ColumnLayout.Column>
                <ColumnLayout.Column span={4}>
                    <TableFilter
                        handleChange={(e, { value }) => {
                            setCurrentPage(0);
                            setSearchText(value);
                        }}
                    />
                </ColumnLayout.Column>
                <ColumnLayout.Column
                    span={4}
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Paginator
                        onChange={(e, { page }) => setCurrentPage(page - 1)}
                        current={currentPage + 1}
                        alwaysShowLastPageLink
                        totalPages={Math.ceil(totalElement / pageSize)}
                        style={{
                            marginRight: '30px',
                        }}
                    />
                    <Button label="Add" appearance="primary" onClick={handleRequestModalOpen} />
                </ColumnLayout.Column>
            </ColumnLayout.Row>
        </ColumnLayout>
    );
}

TableHeader.propTypes = {
    page: PropTypes.string,
    services: PropTypes.array,
    totalElement: PropTypes.number,
    handleRequestModalOpen: PropTypes.func,
};

export default TableHeader;
