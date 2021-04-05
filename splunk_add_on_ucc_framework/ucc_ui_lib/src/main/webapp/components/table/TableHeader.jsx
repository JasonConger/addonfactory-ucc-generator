import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Select from '@splunk/react-ui/Select';
import Button from '@splunk/react-ui/Button';
import Paginator from '@splunk/react-ui/Paginator';
import { _ } from '@splunk/ui-utils/i18n';

import TableFilter from './TableFilter';
import TableContext from '../../context/TableContext';
import { TableSelectBoxWrapper } from './CustomTableStyle';
import { PAGE_INPUT } from '../../constants/pages';

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

    const itemLabel = page === PAGE_INPUT ? 'Input' : 'Item';

    const getSearchTypeDropdown = () => {
        if (services.length < 2) {
            return null;
        }
        let arr = [];
        arr = services.map((service) => {
            return <Select.Option key={service.name} label={service.title} value={service.name} />;
        });

        arr.unshift(<Select.Option key="all" label={_('All')} value="all" />);
        return (
            <Select
                value={searchType}
                onChange={(e, { value }) => {
                    setCurrentPage(0);
                    setSearchType(value);
                }}
            >
                {arr}
            </Select>
        );
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #ccc',
                paddingTop: '5px',
                marginBottom: '5px',
            }}
        >
            <div>
                {totalElement}
                {totalElement > 1 ? _(` ${itemLabel}s`) : _(` ${itemLabel}`)}
                {page === PAGE_INPUT ? (
                    <TableSelectBoxWrapper>
                        <Select
                            value={pageSize}
                            onChange={(e, { value }) => {
                                setCurrentPage(0);
                                setPageSize(value);
                            }}
                        >
                            <Select.Option key="10" label={_('10 Per Page')} value={10} />
                            <Select.Option key="25" label={_('25 Per Page')} value={25} />
                            <Select.Option key="50" label={_('50 Per Page')} value={50} />
                        </Select>
                        {getSearchTypeDropdown()}
                    </TableSelectBoxWrapper>
                ) : null}
            </div>
            <div
                style={{
                    maxWidth: '300px',
                    width: '100%',
                }}
            >
                <TableFilter
                    handleChange={(e, { value }) => {
                        setCurrentPage(0);
                        setSearchText(value);
                    }}
                />
            </div>
            <div>
                <Paginator
                    onChange={(e, val) => setCurrentPage(val.page - 1)}
                    current={currentPage + 1}
                    alwaysShowLastPageLink
                    totalPages={Math.ceil(totalElement / pageSize)}
                    style={{
                        marginRight: '30px',
                    }}
                />
                {page === PAGE_INPUT ? null : (
                    <Button
                        label={_('Add')}
                        appearance="primary"
                        onClick={handleRequestModalOpen}
                    />
                )}
            </div>
        </div>
    );
}

TableHeader.propTypes = {
    page: PropTypes.string,
    services: PropTypes.array,
    totalElement: PropTypes.number,
    handleRequestModalOpen: PropTypes.func,
};

export default TableHeader;
