/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";

export async function createDocument(accessToken: string, title: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const docs = google.docs({ version: "v1", auth });

    try {
        const res = await docs.documents.create({
            requestBody: {
                title: title,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
}

export async function getDocument(accessToken: string, documentId: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const docs = google.docs({ version: "v1", auth });

    try {
        const res = await docs.documents.get({
            documentId: documentId,
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching document:", error);
        throw error;
    }
}

/**
 * Extract plain text from the Google Docs JSON structure.
 */
export function extractTextFromDocument(doc: any): string {
    const content = doc.body?.content;
    if (!content) return "";

    let text = "";

    content.forEach((element: any) => {
        if (element.paragraph) {
            element.paragraph.elements.forEach((el: any) => {
                if (el.textRun) {
                    text += el.textRun.content;
                }
            });
        } else if (element.table) {
            // Simplified table handling
            element.table.tableRows.forEach((row: any) => {
                row.tableCells.forEach((cell: any) => {
                    cell.content.forEach((contentElement: any) => {
                        if (contentElement.paragraph) {
                            contentElement.paragraph.elements.forEach((el: any) => {
                                if (el.textRun) {
                                    text += el.textRun.content;
                                }
                            });
                        }
                    });
                    text += " | "; // Column separator
                });
                text += "\n";
            });
        }
    });

    return text;
}
