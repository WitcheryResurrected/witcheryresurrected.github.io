using System.Collections.Generic;
using System.IO;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WitcheryResurrectedWeb.Suggestions;

namespace SuggestionDataTests
{
    [TestClass]
    public class Tests
    {
        [TestMethod]
        public void WriteAndReadFile()
        {
            if (File.Exists("test.bin")) File.Delete("test.bin");

            var writeHandler = new SuggestionsHandler("test.bin")
            {
                Suggestions =
                {
                    [int.MaxValue] = new Suggestion(ulong.MinValue, ulong.MaxValue, SuggestionState.Approved, "Test",
                        new HashSet<string> { "Some", "Keywords" })
                }
            };
            writeHandler.Flush();

            var readHandler = new SuggestionsHandler("test.bin");

            Assert.IsTrue(readHandler.Suggestions.ContainsKey(int.MaxValue),
                "Suggestion ID failed to save or load properly.");

            var suggestionA = writeHandler.Suggestions[int.MaxValue];
            var suggestionB = readHandler.Suggestions[int.MaxValue];

            Assert.AreEqual(suggestionA.Message, suggestionB.Message, "Message ID failed to save or load properly.");
            Assert.AreEqual(suggestionA.Author, suggestionB.Author, "Author ID failed to save or load properly.");
            Assert.AreEqual(suggestionA.State, suggestionB.State, "Suggestion state failed to save or load properly.");
            Assert.AreEqual(suggestionA.AuthorName, suggestionB.AuthorName,
                "Author name failed to save or load properly.");

            Assert.AreEqual(suggestionA.Keywords.Count, suggestionB.Keywords.Count,
                "Keywords failed to save or load properly.");
            foreach (var keyword in suggestionA.Keywords)
                Assert.IsTrue(suggestionB.Keywords.Contains(keyword), "Keywords failed to save or load properly.");
        }
    }
}
