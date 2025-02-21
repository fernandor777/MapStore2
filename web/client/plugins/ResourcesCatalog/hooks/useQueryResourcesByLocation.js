/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useEffect } from 'react';
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import url from 'url';
import axios from '../../../libs/ajax';
import castArray from 'lodash/castArray';
import uniq from 'lodash/uniq';
import { clearQueryParams } from '../utils/ResourcesFiltersUtils';
import useIsMounted from './useIsMounted';

const cleanParams = (params, exclude = ['d']) => {
    return Object.keys(params)
        .filter((key) => !exclude.includes(key))
        .reduce((acc, key) =>
            (!params[key] || params[key].length === 0)
                ? acc : { ...acc, [key]: isArray(params[key])
                    ? params[key].map(value => value + '')
                    : `${params[key]}`
                }, {});
};

const getParams = (locationSearch = '', { defaultPage = 1, exclude } = {}) => {
    const { query: locationQuery } = url.parse(locationSearch || '', true);
    const { page, ...cleanedParams } = cleanParams(locationQuery, exclude);
    return [
        cleanedParams,
        page ? parseFloat(page) : defaultPage
    ];
};

const mergeParams = (params, defaultQuery) => {
    const updatedDefaultQuery = Object.keys(defaultQuery || {}).reduce((acc, key) => {
        if (defaultQuery[key] && params[key]) {
            return {
                ...acc,
                [key]: uniq([...castArray(defaultQuery[key]), ...castArray(params[key] )])
            };
        }
        return {
            ...acc,
            [key]: defaultQuery[key]
        };
    }, {});
    return {
        ...params,
        ...updatedDefaultQuery
    };
};

const useQueryResourcesByLocation = ({
    id,
    setLoading = () => {},
    setResources = () => {},
    setResourcesMetadata = () => {},
    request = () => Promise.resolve({}),
    defaultQuery,
    pageSize,
    customFilters,
    location,
    onPush = () => {},
    user,
    queryPage,
    search,
    onReset = () => {}
}) => {

    const _prevLocation = useRef();
    const requestResources = useRef();
    const requestTimeout = useRef();

    const isMounted = useIsMounted();

    const source = useRef();
    const createToken = () => {
        if (source?.current?.cancel) {
            source.current?.cancel();
            source.current = undefined;
        }
        const cancelToken = axios.CancelToken;
        source.current = cancelToken.source();
    };

    const clearRequestTimeout = () => {
        if (requestTimeout.current) {
            clearTimeout(requestTimeout.current);
            requestTimeout.current = undefined;
        }
    };

    requestResources.current = (params) => {
        clearRequestTimeout();
        createToken();
        setLoading(true, id);
        requestTimeout.current = setTimeout(() => {
            const requestParams = cleanParams(mergeParams(params, defaultQuery));
            request({
                params: {
                    ...requestParams,
                    customFilters,
                    pageSize
                },
                config: {
                    cancelToken: source?.current?.token
                }
            }, { user })
                .then((response) => isMounted(() => {
                    setResources(response.resources, id);
                    setResourcesMetadata({
                        isNextPageAvailable: response.isNextPageAvailable,
                        params,
                        locationSearch: location.search,
                        locationPathname: location.pathname,
                        total: response.total
                    }, id);
                }))
                .catch((error) => isMounted(() => {
                    if (!axios.isCancel(error)) {
                        setResources([], id);
                        setResourcesMetadata({
                            isNextPageAvailable: false,
                            params,
                            locationSearch: location.search,
                            locationPathname: location.pathname,
                            total: 0,
                            error: true
                        }, id);
                    }
                }))
                .finally(() => isMounted(() => {
                    setLoading(false, id);
                }));
        }, 300);
    };

    const _queryPage = useRef();
    _queryPage.current = queryPage;

    useEffect(() => {
        const [currentParams, currentPage] = getParams(location.search);
        requestResources.current({
            ...currentParams,
            ...(_queryPage.current && { page: currentPage })
        });
    }, [pageSize, JSON.stringify(defaultQuery), user]);

    useEffect(() => {
        const prevLocation = _prevLocation.current;
        const [previousParams, previousPage] = getParams(prevLocation?.search);
        const [currentParams, currentPage] = getParams(location.search);
        const isPageUpdated = _queryPage.current
            ? currentPage !== previousPage
            : false;
        const shouldUpdate = prevLocation === undefined
            || isPageUpdated
            || !isEqual(currentParams, previousParams);
        if (shouldUpdate) {
            requestResources.current({
                ...currentParams,
                ...(_queryPage.current && { page: currentPage })
            });
        }
        _prevLocation.current = location;
    }, [location]);

    function handleSearch(nextParams) {
        const { query } = url.parse(location.search, true);
        if (nextParams?.page !== undefined && !queryPage) {
            requestResources.current({
                ...query,
                page: nextParams.page
            });
            return;
        }
        const nextQuery = cleanParams({ ...omit(query, ['page']), ...nextParams }, []);
        const nextSearch = url.format({ query: nextQuery });
        if (location.search !== nextSearch) {
            onPush({
                search: nextSearch
            });
        }
        return;
    }

    function handleClear() {
        const newParams = clearQueryParams(location);
        handleSearch(newParams);
    }

    useEffect(() => {
        if (search?.id) {
            if (search.clear) {
                handleClear();
            } else if (search.refresh) {
                const { query } = url.parse(location.search, true);
                requestResources.current(query);
            } else {
                handleSearch(search?.params);
            }
            onReset();
        }
    }, [search?.id]);

    useEffect(() => {
        return () => {
            if (source?.current?.cancel) {
                source.current.cancel();
                source.current = undefined;
            }
            clearRequestTimeout();
        };
    }, []);

    return {
        search: handleSearch,
        clear: handleClear
    };
};

export default useQueryResourcesByLocation;
