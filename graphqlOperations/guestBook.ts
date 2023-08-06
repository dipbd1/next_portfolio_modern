import { gql } from "@apollo/client"

export default {
  Queries: {
    getComments: gql`
      query GetComments($first: Int!, $after: String) {
        guestBooksConnection(
          first: $first
          after: $after
          orderBy: createdAt_DESC
          stage: DRAFT
        ) {
          edges {
            node {
              comment
              createdAt
              id
              name
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
  },
  Mutations: {
    createComment: gql`
      mutation CreateGuestBook($name: String!, $comment: String!) {
        createGuestBook(data: { comment: $comment, name: $name }) {
          name
          id
          comment
          createdAt
        }
      }
    `,
    publishComment: gql`
    mutation PublishGuestBook($id: ID!) {
      publishGuestBook(where: { id: $id }) {
        name
        id
        comment
        createdAt
      }
    }
  `,
  },


}
