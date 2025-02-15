/* ------------------------------------------------------------------------- *
 * Copyright 2002-2022, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Alert, LinearProgress } from '@mui/material'

import { useViews } from 'client/features/Auth'
import { useGetServiceQuery } from 'client/features/OneApi/service'
import { getAvailableInfoTabs } from 'client/models/Helper'
import { RESOURCE_NAMES } from 'client/constants'

import Tabs from 'client/components/Tabs'
import Info from 'client/components/Tabs/Service/Info'
import Roles from 'client/components/Tabs/Service/Roles'
import Log from 'client/components/Tabs/Service/Log'
import Actions from 'client/components/Tabs/Service/Actions'

const getTabComponent = (tabName) =>
  ({
    info: Info,
    roles: Roles,
    log: Log,
    schedulerAction: Actions,
  }[tabName])

const ServiceTabs = memo(({ id }) => {
  const { view, getResourceView } = useViews()
  const { isLoading, isError, error } = useGetServiceQuery({ id })

  const tabsAvailable = useMemo(() => {
    const resource = RESOURCE_NAMES.SERVICE
    const infoTabs = getResourceView(resource)?.['info-tabs'] ?? {}

    return getAvailableInfoTabs(infoTabs, getTabComponent, id)
  }, [view])

  if (isError) {
    return (
      <Alert severity="error" variant="outlined">
        {error.data}
      </Alert>
    )
  }

  return isLoading ? (
    <LinearProgress color="secondary" sx={{ width: '100%' }} />
  ) : (
    <Tabs addBorder tabs={tabsAvailable ?? []} />
  )
})

ServiceTabs.propTypes = { id: PropTypes.string.isRequired }
ServiceTabs.displayName = 'ServiceTabs'

export default ServiceTabs
