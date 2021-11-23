declare namespace CLUSTER {
  type PodQuery = {
    // podName=&containerName=(&tailLine=)
    podName: string
    containerName: string
  }

  type SessionQuery = {
    // podName=&containerName=
    podName: string
    containerName: string
  }

  type Environment = {
    name: string;
    displayName: string;
  };

  type Region = {
    name: string;
    displayName: string;
  };

  type ClusterFilter = {
    filter?: string;
    pageNumber: number;
    pageSize: number;
    environment?: string
  };

  type Scope = {
    environment: string;
    region: string;
    regionDisplayName: string;
  }

  type ClusterBase = {
    id: number,
    name: string;
    scope: Scope
    template: {
      name: string;
      release: string;
    };
    updatedAt: string
  }

  type Cluster = {
    fullPath: string,
    fullName?: string,
    application: {
      id: number,
      name: string
    };
    id: number
    name: string;
    priority: string;
    description?: string;
    template: {
      name: string;
      release: string;
    };
    git: {
      url: string;
      subfolder: string;
      branch: string;
      commit: string;
    };
    scope: Scope
    templateInput: any;
    latestDeployedCommit: string;
    createdAt: string;
    updatedAt: string;
  };

  type NewCluster = {
    name: string;
    description?: string;
    git: {
      branch: string;
    };
    templateInput: any
  }

  type ClusterTag = {
    key: string,
    value: string,
  }

  type ClusterTags = {
    tags: ClusterTag[],
  }

  type UpdateCluster = {
    description?: string;
    git: {
      branch: string;
    };
    templateInput: any
  }

  type ClusterBuildDeploy = {
    title: string,
    description?: string;
    git: {
      branch: string;
    };
  }

  type ClusterDeploy = {
    title: string,
    description?: string;
  }

  type ClusterRollback = {
    pipelinerunID: number
  }

  type ClusterDiffs = {
    codeInfo: {
      commitMsg: string
      commitID: string
      link: string
    }
    configDiff: string
  }

  type PodFromBackend = {
    metadata: {
      namespace: string
      creationTimestamp: string
    }
    spec: {
      nodeName: string,
      initContainers: [{
        name: string,
        image: string,
      }]
      containers: [{
        name: string,
        image: string,
      }]
    }
    status: {
      hostIP: string,
      podIP: string
      phase: string
      containerStatuses: [{
        name: string
        ready: boolean
        restartCount: number
        state: {
          state: string
          reason: string
          message: string
        }
      }]
      events: [{
        type: string
        reason: string
        message: string
        count: number
        eventTimestamp: string
      }]
    }
  }

  type ClusterStatus = {
    runningTask: {
      task: string,
      pipelinerunID: number,
      taskStatus: string,
    }
    clusterStatus: {
      status: string,
      step: {
        index: number,
        total: number,
      }
      podTemplateHash: string,
      replicas: number,
      versions: Record<string, {
        replicas: number
        pods: Record<string, PodFromBackend>
      }>
    }
  }

  type PodInTable = {
    key: string
    podName: string
    status: string
    ip: string
    onlineStatus: string
    createTime?: string
    restartCount?: number
    containerName?: string
    namespace?: string
  }

  type PodOnlineOfflineResult = {
    result: boolean,
    stdout: string,
    stderr: string,
    error: {
      ErrStatus: {
        message: string
      }
    }
  }

}
