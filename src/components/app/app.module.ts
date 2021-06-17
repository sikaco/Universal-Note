import { combineEpics } from 'redux-observable'

import { EpicInput, GlobalState, noOpAction } from '@State'

export const epic = combineEpics<any>(
  (action$: EpicInput<SearchParams>) => {
    return action$
      .ofType(`${actions.searchAll}`)
      .filter((action) => typeof action.payload !== 'undefined')
      .switchMap((action) => {
        const { q, _organizationId, pageSize } = action.payload!
        const tql = ''  // “全部”界面下没有筛选器，tql 应该为空
        return Observable.combineLatest(
          // 此项返回的 nextPageToken 为空，为防止 nextPageToken 被覆盖必须放在最前。
          searchRequest.searchTasksByUniqueId(q, _organizationId),

          searchRequest.searchEvents(q, tql, pageSize, _organizationId),
          searchRequest.searchPosts(q, tql, pageSize, _organizationId),
          searchRequest.searchProjects(q, tql, pageSize, _organizationId),
          searchRequest.searchTasks(q, tql, pageSize, _organizationId),
          searchRequest.searchUsers(q, tql, pageSize, _organizationId),
          searchRequest.searchWorks(q, tql, pageSize, _organizationId),
          searchRequest.searchCollections(q, tql, pageSize, _organizationId)
        )
          .map((response: (TaskIdResponse | Response<Schema.Any>)[]) => {
            const totalSize = _.pluck(response, 'totalSize').reduce((prev, curr) => prev + curr)
            const [tasksById, event, post, project, task, user, work, collection] = _.pluck(response, 'result')

            const taskRes = _.chain(tasksById)
              .map(t => ({ ...t, taskId: `${(t.project as Partial<ProjectSchema>).uniqueIdPrefix}-${t.uniqueId}` }))
              .concat(task)
              .uniq('_id')
              .value()

            return actions.searchAllSuccess({
              totalSize,
              result: { tasksById, event, post, project, user, work, collection, task: taskRes }
            })
          })
          .catch((error) => {
            throwError(error)
            return [actions.searchAllFailure()]
          })
      })
  },
)
